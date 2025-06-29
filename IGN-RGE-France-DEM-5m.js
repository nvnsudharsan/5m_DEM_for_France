var rge_alti5 = ee.Image("projects/sat-io/open-datasets/IGN_RGE_Alti_5m");

// Define your region of interest (ROI)
var roi = ee.Geometry.Rectangle([2.0, 48.6, 2.6, 49.1]);

// Center the map on the ROI
Map.centerObject(roi, 10);  // Adjust zoom if needed

// Clip elevation data to ROI
var rge_clipped = rge_alti5.clip(roi);

// Use the terrain algorithms to compute a hillshade from the clipped DEM
var shade = ee.Terrain.hillshade(rge_clipped);
Map.addLayer(shade, {}, 'hillshade', false);

// Create an ocean mask (elevation <= 0)
var ocean = rge_clipped.lte(0);
Map.addLayer(ocean.mask(ocean), {palette: '000022'}, 'ocean', false);

// Define custom elevation color palette
var elevationPalette = ['006600', '002200', 'fff700', 'ab7634', 'c4d0ff', 'ffffff'];
var visParams = {min: 1, max: 3000, palette: elevationPalette};

// Combine ocean and land into one visualized mosaic (only for ROI)
var visualized = ee.ImageCollection([
  rge_clipped.mask(ocean.not()).visualize(visParams),
  ocean.mask(ocean).visualize({palette: '000022'})
]).mosaic();

// Add the visualized image clipped to ROI
Map.addLayer(visualized, {}, 'Elevation in ROI');

// Export the clipped visualized image to Google Drive
Export.image.toDrive({
  image: visualized.clip(roi),  // Clip again to be safe
  description: 'elevation_visualized_ROI',
  folder: 'GEE_exports',        // Customize if needed
  region: roi,
  scale: 30,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});
