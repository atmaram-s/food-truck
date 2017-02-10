'use strict';

angular.module('FoodTruck').directive('truckMap', function() {
    return {
        restrict: 'E',
        templateUrl: 'src/views/truck-map.html',
        scope: {
            initialize: '@'
        },
        controller: 'TruckMapController',
        controllerAs: 'truckMap',
        bindToController: true
    };
});

angular.module('FoodTruck').controller('TruckMapController', [
    '$rootScope',
    '$element',
    '$timeout',
    '$mdSidenav',
    'locator',
    'utils',
    'dataAPI',
    'MAP_ICON',
    function($rootScope, $element, $timeout, $mdSidenav, locator, utils, dataAPI, MAP_ICON) {
        var truckMap = this;

        var map;
        var autocomplete;
        var selectedLocationObj;
        var locationMarker;
        var truckMarkerArray = [];

        var mapDOM = utils.findDOMElementWithClassName('truck-map-container', $element.find('div'));
        var inputDOM = $element.find('input')[0];

        truckMap.foodTrucks = [];
        truckMap.searchRange = 500;
        truckMap.isValidInputLocation = false;
        truckMap.showList = false;

        $rootScope.requestQueue.push(1);
        utils.getCurrentLocation().then(function() {
            $rootScope.requestQueue.pop();
            truckMap.fetchData();
            _initMap();
        }, function(locationFetchError) {
            $rootScope.requestQueue.pop();
            _initMap();
        });

        truckMap.fetchData = function(range) {
            $rootScope.requestQueue.push(1);
            if (truckMap.isValidInputLocation) {
                _updateMap();
            }
            dataAPI.fetchData(locator.location.lat, locator.location.lng, truckMap.searchRange).then(function(foodTruckDetails) {
                truckMap.foodTrucks = foodTruckDetails;
                truckMap.updateTruckMarkers(foodTruckDetails);
                $rootScope.requestQueue.pop();
            }, function(dataFetchError) {
                $rootScope.requestQueue.pop();
            });
        };

        truckMap.isSearchDisabled = function() {
            if (truckMap.isValidInputLocation && truckMap.inputLocation.length) {
                if (truckMap.searchRange >= 50 && truckMap.searchRange <= 5000) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        };

        truckMap.showTruckDetail = function(selectedTruck) {
            if (!truckMap.selectedTruck || (selectedTruck.objectid !== truckMap.selectedTruck.objectid)) {
                if ($mdSidenav('truckDetail').isOpen()) {
                    $mdSidenav('truckDetail').toggle().then(function() {
                        truckMap.selectedTruck = selectedTruck;
                        $timeout(function() {
                            $mdSidenav('truckDetail').toggle();
                        }, 200);
                    });
                } else {
                    truckMap.selectedTruck = selectedTruck;
                    $mdSidenav('truckDetail').toggle();
                }
            } else {
                return;
            }
        };

        truckMap.closeDetail = function() {
            $mdSidenav('truckDetail').toggle();
            truckMap.selectedTruck = null;
        };

        truckMap.updateTruckMarkers = function(newList) {
            _clearTruckMarkers();
            _createTruckMarkers(newList);
        };

        function _initMap() {
            var center;
            var location = locator.location;

            $rootScope.locationName = location.name;

            if (!location.lat) {
                center = {
                    lat: 37.7749,
                    lng: -122.4194
                };
            } else {
                center = {
                    lat: location.lat,
                    lng: location.lng
                };
            }

            map = new google.maps.Map(mapDOM, {
                center: center,
                zoom: 15
            });

            autocomplete = new google.maps.places.Autocomplete(inputDOM);
            autocomplete.bindTo('bounds', map);

            locationMarker = _createMarker('location', new google.maps.LatLng(location));

            autocomplete.addListener('place_changed', _onPlaceChanged);
        }

        function _createMarker(type, location) {
            var iconUrl;

            switch (type) {
                case 'location':
                    iconUrl = MAP_ICON.LOCATION_MARKER;
                    break;

                case 'truck':
                    iconUrl = MAP_ICON.TRUCK_MARKER;
                    break;

                default:
                    break;
            }

            return new google.maps.Marker({
                map: map,
                position: location,
                icon: {
                    url: iconUrl,
                    scaledSize: new google.maps.Size(50, 62)
                },
                optimized: false
            });
        }

        function _onPlaceChanged() {
            var place = autocomplete.getPlace();

            $timeout(function() {
                if (!place.geometry) {
                    truckMap.isValidInputLocation = false;

                    return;
                }

                truckMap.isValidInputLocation = true;
                selectedLocationObj = place;
            }, 0);
        }

        function _onMarkerClicked(marker) {
            var self = this;
            map.setCenter(marker.latLng);
            map.setZoom(17);
            var selectedTruck = R.find(R.propEq('objectid', self.truckId))(truckMap.foodTrucks);
            truckMap.showTruckDetail(selectedTruck);
        }

        function _updateMap() {
            if (selectedLocationObj.geometry.viewport) {
                map.fitBounds(selectedLocationObj.geometry.viewport);
            } else {
                map.setCenter(selectedLocationObj.geometry.location);
                map.setZoom(17);
            }

            var locationObject = {
                lat: selectedLocationObj.geometry.location.lat(),
                lng: selectedLocationObj.geometry.location.lng(),
                name: utils.getPlaceNameFromAddress(selectedLocationObj.address_components)
            }

            locationMarker.setMap(null);
            locationMarker = _createMarker('location', selectedLocationObj.geometry.location);

            locator.location = locationObject;
            $rootScope.locationName = locationObject.name;
        }

        function _createTruckMarkers(truckList) {
            R.forEach(function(truckDetail) {
                var marker = _createMarker('truck', new google.maps.LatLng(truckDetail.latitude, truckDetail.longitude));
                marker.truckId = truckDetail.objectid;
                marker.addListener('click', _onMarkerClicked)
                truckMarkerArray.push(marker);
            }, truckList)
        }

        function _clearTruckMarkers() {
            R.forEach(function(truckMarker) {
                truckMarker.setMap(null);
            }, truckMarkerArray);

            truckMarkerArray = [];
        }
    }
]);
