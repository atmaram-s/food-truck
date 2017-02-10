'use strict';

angular.module('FoodTruck').directive('loader', function() {
  return {
    restrict: 'E',
    templateUrl: 'src/views/loader.html'
  };
});
