'use strict';

angular.module('FoodTruck').directive('truckList', function() {
    return {
        restrict: 'E',
        templateUrl: 'src/views/truck-list.html',
        scope: {
            foodTrucks: '=',
            onItemClick: '&',
            onListChanged: '&'
        },
        controller: 'TruckListController',
        controllerAs: 'truckList',
        bindToController: true
    };
});

angular.module('FoodTruck').controller('TruckListController', [
    '$scope',
    'utils',
    function($scope, utils) {
        var truckList = this;
        var tentativeList = [];
        var DynamicItems = function() {};

        truckList.filterList = [];

        DynamicItems.prototype.getItemAtIndex = function(index) {
            if (tentativeList.length) {
                return tentativeList[index];
            } else {
                return null;
            }
        };

        DynamicItems.prototype.getLength = function() {
            return tentativeList.length;
        }

        $scope.$watch(angular.bind(this, function() {
            return truckList.foodTrucks;
        }), function(newList) {
            _formatListAndResetFilters(newList);
        });

        truckList.dynamicItems = new DynamicItems();

        truckList.onFilterListChanged = function(operation) {
            switch (operation) {
                case 'add':
                    _updateListAndFilters(utils.filterArray(tentativeList, truckList.appliedFilters));
                    break;

                case 'remove':
                    _updateListAndFilters(utils.filterArray(truckList.foodTrucks, truckList.appliedFilters));
                    break;

                default:
                    break;
            }
        };

        function _updateListAndFilters(unformattedList) {
            var formattedResponse = utils.formatFoodTruckDetails(unformattedList);

            truckList.filterList = formattedResponse.filters;
            tentativeList = formattedResponse.truckDetails;
            truckList.onListChanged({newList: tentativeList})
        }

        function _formatListAndResetFilters(newList) {
            _updateListAndFilters(newList);

            truckList.appliedFilters = [];
        }
    }
]);
