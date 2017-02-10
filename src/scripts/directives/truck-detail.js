'use strict';

angular.module('FoodTruck').directive('truckDetail', function() {
    return {
        restrict: 'E',
        templateUrl: 'src/views/truck-detail.html',
        scope: {
            selectedTruck: '='
        }
    };
});
