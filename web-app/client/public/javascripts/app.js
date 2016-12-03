angular.module('tassApp', [])

.controller('mainController', function($scope, $http) {

    $scope.formData = {};
    $scope.todoData = {};
    $scope.candidates = {};

    var map;

    var vecLayer;
    $scope.updateCand = function() {
      var selectedCand = $scope.selectedCand;
      if (map === undefined
          && selectedCand !== undefined
          && selectedCand.cand_id !== undefined) {
            // show base maps
            map = getBaseMap();
      }

      var finDataInd = $scope.data_individual;
      var finDataComm = $scope.data_committees;
      if (selectedCand === undefined && selectedCand.cand_id === undefined) {
            return;
      }
      console.log(selectedCand);
      console.log(finDataComm);
      console.log(finDataInd);
      console.log("vec la: " + vecLayer)
      map.removeLayer(vecLayer);
      // vecLayer = undefined;
      console.log($scope.selectedCand.cand_id);

      vecLayer = getVectorLayer($scope.selectedCand.cand_id, finDataInd, finDataComm);
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

function getVectorLayer(candId, finDataInd, finDataComm) {
  var geoJSON = new ol.format.GeoJSON();
  var sourceVector = new ol.source.Vector({
      loader: function(extent, resolution, projection) {
        var viewName;
        if (finDataInd === true && finDataComm === true) {
          viewName = 'cite:sum_96';
        } else if (finDataInd === true) {
          viewName = 'cite:sum_96_ind';
        } else if (finDataComm === true) {
          viewName = 'cite:sum_96_comm';
        } else {
          console.log("Don't know which vector data to get!");
          return;
        }
        console.log(viewName + " " + candId);
        var url =
          'http://localhost:8080/geoserver/cite/wfs?service=WFS' +
          '&version=1.1.0&request=GetFeature' +
          '&typename=' + viewName +
          '&outputFormat=text/javascript&format_options=callback:loadFeatures' +
          '&viewparams=CAND_ID:' + candId + //'S2IL00028'
          '&srsName=EPSG:3857&bbox=' + extent.join(',');// + ',EPSG:3857';
          // '&srsName=EPSG:4326&bbox=' + extent.join(',');// + ',EPSG:3857';
          console.log(url);

          $.ajax({url: url, dataType: 'jsonp', jsonp: false});
        }
        , strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
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
    }))
    , opacity: 0.8
  });
}

function getBaseMap() {
  return new ol.Map({
    layers: [getBaseMapLayer()],
    target: 'map',
    view: new ol.View({
      center: [-10000000, 6000000],
      zoom: 2
    }),
    controls:[
      new ol.control.ZoomSlider()
  ]});
}

function getColor(feature) {
  // console.log("G': " + feature.G.sum);
  return feature.G.sum > 20000 ? '#800026' :
         feature.G.sum > 10000 ? '#BD0026' :
         feature.G.sum > 8000 ? '#E31A1C' :
         feature.G.sum > 6000 ? '#FC4E2A' :
         feature.G.sum > 3000 ? '#FD8D3C' :
         feature.G.sum > 1000 ? '#FEB24C' :
         feature.G.sum > 500  ? '#FED976' :
                                '#FFEDA0' ;
}
