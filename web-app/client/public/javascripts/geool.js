angular.module('tassApp').controller('mapController', function($scope, $http) {
  // getGeoserverMaps();
  // leafletMap();
});


/// -----------------------------------------------------
function leafletMap() {
  var map = L.map('map').setView([46.49414, -69.257], 2);

  var newLayer = new L.TileLayer.WMS(
    "http://localhost:8080/geoserver/cite/wms",
    {
      version: '1.1.0',
      layers: 'cite:geo_zip_codes',
      tiled: true,
      // transparent: true,
      srs: 'EPSG:3857',
      width: 768,
      height: 370
    });

  map.addLayer(newLayer);

  var geojsonLayerWells = new L.GeoJSON();

  function style(feature) {
    console.log("Feature: " + feature);
    return {
      weight: 10,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.8,
      fillColor: '#666666'
    };
  }
  window.loadGeoJson = function(data) {
      console.log(data);
      console.log("len of features: " + data.features.length);

      geojsonLayerWells.addData(data);
      geojsonLayerWells.setStyle(style(data.features[0].properties.name));
      map.addLayer(geojsonLayerWells);
  };

  map.on('moveend', function() {
    // var url =
    //   'http://localhost:8080/geoserver/cite/wfs?service=WFS' +
    //     '&version=1.1.0&request=GetFeature&typename=cite:bushhajs' +
    //     '&outputFormat=text/javascript&format_options=callback:loadFeatures' +
    //     '&srsName=EPSG:3857&bbox=' + extent.join(',');// + ',EPSG:3857';
      var geoJsonUrl ='http://localhost:8080/geoserver/cite/wfs';
      var defaultParameters = {
          service: 'WFS',
          version: '1.1.0',
          request: 'GetFeature',
          typeName: 'cite:bushhajs',
          outputFormat: 'text/javascript',
          format_options: 'callback:loadGeoJson',
          srsName: 'EPSG:3857'
      };

      var customParams = {
          bbox: map.getBounds().toBBoxString(),
      };
      var parameters = L.Util.extend(defaultParameters, customParams);
      console.log(geoJsonUrl + L.Util.getParamString(parameters));

      $.ajax({
          url: geoJsonUrl + L.Util.getParamString(parameters),
          dataType: 'jsonp',
          jsonp: false
      });
  });
}
