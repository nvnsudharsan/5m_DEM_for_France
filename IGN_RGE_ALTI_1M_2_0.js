// Load the dataset and select the elevation band
var dataset = ee.Image('IGN/RGE_ALTI/1M/2_0/FXX');
var elevation = dataset.select('MNT');

// Define full ROI
var xmin = 2.0;
var xmax = 2.6;
var ymin = 48.6;
var ymax = 49.1;

var numTiles = 10;
var dx = (xmax - xmin) / numTiles;

// Loop through tiles
for (var i = 0; i < numTiles; i++) {
  var tileXmin = xmin + i * dx;
  var tileXmax = tileXmin + dx;
  
  var tileGeometry = ee.Geometry.Rectangle([tileXmin, ymin, tileXmax, ymax]);
  var tileClipped = elevation.clip(tileGeometry);
  
  Export.image.toDrive({
    image: tileClipped,
    description: 'IGN_Elevation_Tile_' + i,
    folder: 'GEE_exports',
    fileNamePrefix: 'IGN_Elevation_1m_Tile_' + i,
    region: tileGeometry,
    scale: 1,
    crs: 'EPSG:4326',
    maxPixels: 1e9
  });
}
