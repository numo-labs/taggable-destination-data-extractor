var fs        = require('fs');
var geonames  = require('./geonames_lambda');
var insert    = require('./create_document');
var filename  = '../tiles/all_destination_tiles.json'
var tiles     = require(filename);
var countdown = Object.keys(tiles);

Object.keys(tiles).forEach(function (id) {
  var tile = tiles[id];
  geonames(tile, function (err, data) {
    if (err || !data.Payload ) {
      console.log(' - - - - - - - - - - - - - - - - - - - ');
      console.log(err, data);
      --countdown;
      // process.exit()
    }
    try {
      var geo = JSON.parse(data.Payload);
      console.log(' >> ', geo);
      console.log(JSON.stringify(tile, null, 2));

      tile.tags.push(geo[geo.length - 1].tags[0]);
      // tiles[id] = tile;
      insert(tile, function (err, res) {
        if (--countdown === 0) {
          console.log(' - - - - - - - - - - - - - - - - - - - ');
          console.log(err, res);
          // fs.writeFileSync(filename, JSON.stringify(tiles, null, 2));
        }
      });
    } catch (e) {
      console.log(e);
      --countdown;
    }
  });
});
