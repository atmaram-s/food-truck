'use strict';

angular.module('FoodTruck').factory('dataAPI', [
    '$http',
    '$q',
    'utils',
    'API',
    function($http, $q, utils, API) {
        return {
            fetchData: function(lat, long, radius) {
                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: API.URL,
                    headers: {
                        'X-App-Token': API.APP_TOKEN
                    },
                    params: {
                        '$where': 'within_circle(location,' + lat + ',' + long + ',' + radius + ') AND facilitytype="Truck"'
                    }
                }).then(function(response) {
                    deferred.resolve(response.data);
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                })
                return deferred.promise;
            }
        };
    }
]);
