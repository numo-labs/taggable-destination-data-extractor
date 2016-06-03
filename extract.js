var fs = require('fs');
var files = ['numo-areas', 'numo-area-images', 'numo-area-texts'];

var tiles = {};
var csvString, rows;
/**
 * first extract the Name and Location (Latitude & Longitude) from Areas
 * see readme for column indexes
 */

csvString = fs.readFileSync('./rawdata/' + files[0] +'.csv').toString();
rows = CSVToArray(csvString); // parse the .csv file into an Array of Arrays
rows.shift(); // get rid of column names.

rows.forEach(function(row) {
  tiles[row[1]] = {
    _id: 'tile:destination.dk.' + row[1],
    location: {
      lat: row[3],
      lon: row[4]
    },
    displayName: row[0],
    tags: [],
    metadata: [],
    content: [
      {
        // url: test,
        market: 'dk',
        language: 'da',
        sections: []
      }
    ],
    markets: {},
    active: true,
    description: ''
  };
});

var images = {}; // store all images by the WVitemID
/**
 * exctact ALL the images
 */
csvString = fs.readFileSync('./rawdata/' + files[1] +'.csv', 'utf8').toString();
rows = CSVToArray(csvString); // parse the .csv file into an Array of Arrays
rows.shift(); // don't need the column names (see readme)

rows.forEach(function (row) {
  if(!images[row[1]]) {
    images[row[1]] = {};
  }
  // enter the matrix of images!
  if(!images[ row[1] ][ row[6] ]) {
    images[ row[1] ][ row[6] ] = [];
  }
  images[ row[1] ][ row[6] ].push(row[2].trim());
});
// console.log(images);

// even though we have lots of images, we are only going to use one!
// I know, its madness! see:
var bestImage = {};

Object.keys(images).filter( function(id) {
  var imgids = Object.keys(images[id]).map(function (id) {
    return parseInt(id, 10);
  }).sort(function(a,b) {
    return parseInt(a, 10) < parseInt(b, 10);
  });
  bestImage[id] = images[ id ][ imgids[0] ][0];
})



csvString = fs.readFileSync('./rawdata/' + files[2] +'.csv').toString();
rows = CSVToArray(csvString); // parse the .csv file into an Array of Arrays
rows.shift(); // don't need the column names (see readme if you want them)
var text = {};
rows.forEach(function (row) {
  if(!text[ row[1] ]) {
    text[ row[1] ] = row[5];
  } else { // append to the existing text after inserting a break
    text[ row[1] ] = text[ row[1] ] + '<br />' + row[5];
  }
});

// var indexes = [];
// var columns = rows[0]
// columns.forEach(function(col, index) {
//   indexes.push(index);
// });
// console.log('| Index: | ' + indexes.join(' | ') + ' |');
// console.log('| Column Name: | ' + columns.join(' | ') + ' |');


Object.keys(tiles).forEach(function (id) {
  tiles[id]['content'][0]['sections'].push({
    title: tiles[id].displayName,
    text: text[id],
    image: bestImage[id]
  });
});

console.log(JSON.stringify(tiles['195366'], null, 2));
fs.writeFileSync('./tiles/all_destination_tiles.json', JSON.stringify(tiles, null, 2));

/**
 * CSVToArray parses any String of Data including '\r' '\n' characters,
 * and returns an array with the rows of data.
 * @param {String} CSV_string - the CSV string you need to parse
 * @param {String} delimiter - the delimeter used to separate fields of data
 * @returns {Array} rows - rows of CSV where first row are column headers
 */
function CSVToArray (CSV_string, delimiter) {
   delimiter = (delimiter || ","); // user-supplied delimeter or default comma

   var pattern = new RegExp( // regular expression to parse the CSV values.
     ( // Delimiters:
       "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
       // Quoted fields.
       "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
       // Standard fields.
       "([^\"\\" + delimiter + "\\r\\n]*))"
     ), "gi"
   );

   var rows = [[]];  // array to hold our data. First row is column headers.
   // array to hold our individual pattern matching groups:
   var matches = false; // false if we don't find any matches
   // Loop until we no longer find a regular expression match
   while (matches = pattern.exec( CSV_string )) {
       var matched_delimiter = matches[1]; // Get the matched delimiter
       // Check if the delimiter has a length (and is not the start of string)
       // and if it matches field delimiter. If not, it is a row delimiter.
       if (matched_delimiter.length && matched_delimiter !== delimiter) {
         // Since this is a new row of data, add an empty row to the array.
         rows.push( [] );
       }
       var matched_value;
       // Once we have eliminated the delimiter, check to see
       // what kind of value was captured (quoted or unquoted):
       if (matches[2]) { // found quoted value. unescape any double quotes.
        matched_value = matches[2].replace(
          new RegExp( "\"\"", "g" ), "\""
        );
       } else { // found a non-quoted value
         matched_value = matches[3];
       }
       // Now that we have our value string, let's add
       // it to the data array.
       rows[rows.length - 1].push(matched_value);
   }
   return rows; // Return the parsed data Array
}
