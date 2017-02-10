'use strict';

angular.module('FoodTruck').factory('utils', [
    '$q',
    'locator',
    'ERROR_LOCATION',
    function($q, locator, ERROR_LOCATION) {
        return {
            formatFoodTruckDetails: function(foodTruckDetailList) {
                var filterArray = [];
                R.forEach(function(foodTruckDetail) {
                    if (foodTruckDetail.hasOwnProperty('fooditems')) {
                        if (typeof foodTruckDetail.fooditems === 'string') {
                            foodTruckDetail.fooditems = foodTruckDetail.fooditems.split(': ');
                            if (foodTruckDetail.fooditems[0] === 'Cold Truck') {
                                foodTruckDetail.fooditems.splice(0, 1);
                            }
                        }

                        R.forEach(function(foodItem) {
                            if (R.indexOf(foodItem, filterArray) === -1) {
                                filterArray.push(foodItem);
                            }
                        }, foodTruckDetail.fooditems);
                    }
                }, foodTruckDetailList);

                return {filters: filterArray, truckDetails: foodTruckDetailList};
            },

            filterArray: function(arrayToFilter, filtersArray) {
                return R.filter(function(itemToFilter) {
                    if (!itemToFilter.hasOwnProperty('fooditems')) {
                        return false;
                    }
                    var diffArray = R.difference(filtersArray, itemToFilter.fooditems);

                    if (!diffArray.length) {
                        return true;
                    } else {
                        return false;
                    }
                }, arrayToFilter);
            },

            findDOMElementWithClassName: function(className, domArray) {
                var element;

                R.forEach(function(domEl) {
                    if (domEl.className === className) {
                        element = domEl;
                        return false;
                    }
                }, domArray);

                return element;
            },

            getCurrentLocation: function() {
                var deferred = $q.defer();
                var self = this;

                if(window.navigator) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var coordinates = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }

                        var geocoder = new google.maps.Geocoder();
                        var latLng = new google.maps.LatLng(coordinates.lat, coordinates.lng)
                        geocoder.geocode({
                            'latLng': latLng
                        }, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (results[0]) {
                                    coordinates.name = self.getPlaceNameFromAddress(results[0].address_components);
                                    locator.location = coordinates;
                                    deferred.resolve();
                                } else {
                                    locator.location = ERROR_LOCATION;
                                    deferred.reject();
                                }
                            }
                        });
                    }, function(error) {
                        console.error(error);
                        locator.location = ERROR_LOCATION;
                        deferred.reject(error);
                    });
                } else {
                    locator.location = ERROR_LOCATION;
                    deferred.reject();
                }

                return deferred.promise;
            },

            getPlaceNameFromAddress: function(addressComponents) {
                var locality;
                var admininstrativeLvl1;
                R.forEach(function(addressComponent) {
                    switch (addressComponent.types[0]) {
                        case 'locality':
                            locality = addressComponent.long_name;
                            break;

                        case 'administrative_area_level_1':
                            admininstrativeLvl1 = addressComponent.long_name;
                            break;

                        default:
                            break;
                    }
                }, addressComponents);

                if (!locality && admininstrativeLvl1) {
                    return admininstrativeLvl1;
                } else if (!(locality && admininstrativeLvl1)) {
                    return addressComponents[addressComponents.length - 1].long_name;
                } else {
                    return locality + ', ' + admininstrativeLvl1;
                }
            }
        };
    }
]);
