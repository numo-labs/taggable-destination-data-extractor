var fs       = require('fs');
var geonames = require('./geonames_lambda');
var insert   = require('./create_document');
var filename = '../tiles/all_destination_tiles.json'
var tiles    = require(filename);
var countdown = Object.keys(tiles);
Object.keys(tiles).forEach(function (id) {
  // console.log(id);
  var tile = tiles[id];
  // console.log(tile);
  geonames(tile, function (err, data) {
    var geo = JSON.parse(data.Payload);
    tile.tags.push(geo[geo.length - 1].tags[0]);
    tiles[id] = tile;
    // insert(tile, function (err, res) {
      if (--countdown === 0) {
        console.log(' - - - - - - - - - - - - - - - - - - - ');
        console.log(err, res);
        fs.writeFileSync(filename, JSON.stringify(tiles, null, 2));
      }
    // });
  });
});
