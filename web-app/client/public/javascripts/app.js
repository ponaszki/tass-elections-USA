angular.module('tassApp', [])

.controller('mainController', function($scope, $http) {

    $scope.formData = {};
    $scope.todoData = {};
    $scope.candidates = {};

    var map = getBaseMap();

    var vecLayer;
    $scope.updateCand = function() {
      map.removeLayer(vecLayer);
      console.log($scope.selectedCand.cand_id);
      vecLayer = getVectorLayer($scope.selectedCand.cand_id);
      map.addLayer(vecLayer);
    }

    $http.get('/api/v1/candidates')
        .success(function(data) {
            $scope.candidates = data;
            console.log("loaded candidates");
        })
        .error(function(error) {
            console.log('Error: ' + error);
    });

});

function getVectorLayer(candId) {
  var geoJSON = new ol.format.GeoJSON();
  var sourceVector = new ol.source.Vector({
      loader: function(extent, resolution, projection) {
        console.log("cand_id in url: " + candId);
        var url =
          'http://localhost:8080/geoserver/cite/wfs?service=WFS' +
            '&version=1.1.0&request=GetFeature&typename=cite:sum_96_param' +
            '&outputFormat=text/javascript&format_options=callback:loadFeatures' +
            '&viewparams=CAND_ID:' + candId + //'S2IL00028'
            '&srsName=EPSG:3857&bbox=' + extent.join(',');// + ',EPSG:3857';

          // console.log("WFS: " + url);
          $.ajax({url: url, dataType: 'jsonp', jsonp: false})
        },
        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
            maxZoom: 1
        }))
  });

  window.loadFeatures = function(response) {
    console.log("len of features: " + response.features.length);
    sourceVector.addFeatures(geoJSON.readFeatures(response));
  };

  return new ol.layer.Vector({
    source: sourceVector,
    style: function(feature) {
      return new ol.style.Style({
        fill : new ol.style.Fill({
          color: getColor(feature),
        }),
        stroke: new ol.style.Stroke({
          color: 'magenta'
        })
      });
    }
  });
}

function getBaseMapLayer() {
  return new ol.layer.Tile({
    source: new ol.source.TileWMS(({
      url: 'http://localhost:8080/geoserver/cite/wms',
      params: {
        'LAYERS': 'cite:geo_zip_codes',
        'TILED': true,
        'VERSION': '1.1.0',
        'WIDTH': 768,
        'HEIGHT': 370,
        'SRS': 'EPSG:3857'
      },
      serverType: 'geoserver'
    })),
    opacity: 0.7
  });
}

function getBaseMap() {
  return new ol.Map({
    layers: [getBaseMapLayer()],
    target: 'map',
    view: new ol.View({
      center: [0, 0],
      zoom: 2
    }),
    controls:[
      new ol.control.ZoomSlider()
  ]});
}

function getColor(feature) {
  console.log("G': " + feature.G.sum);
  return feature.G.sum > 9000 ? '#800026' :
         feature.G.sum > 8000 ? '#BD0026' :
         feature.G.sum > 5000 ? '#E31A1C' :
         feature.G.sum > 2000 ? '#FC4E2A' :
         feature.G.sum > 1000 ? '#FD8D3C' :
         feature.G.sum > 600  ? '#FEB24C' :
         feature.G.sum > 500  ? '#FED976' :
                                '#FFEDA0' ;
}
