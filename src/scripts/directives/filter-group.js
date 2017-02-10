'use strict';

angular.module('FoodTruck').directive('filterGroup', function() {
    return {
        restrict: 'E',
        templateUrl: 'src/views/filter-group.html',
        scope: {
            dataset: '=',
            appliedFilters: '=',
            onFilterListChanged: '&'
        },
        controller: 'FilterGroupController',
        controllerAs: 'filterGroup',
        bindToController: true
    };
});

angular.module('FoodTruck').controller('FilterGroupController', [
    '$element',
    'utils',
    function($element, utils) {
        var filterGroup = this;

        var filterListDOM = utils.findDOMElementWithClassName('filter-group-selected-list', $element.find('ul'));
        var $filterListDOM = angular.element(filterListDOM);

        filterGroup.appliedFilters = [];
        filterGroup.expand = false;

        filterGroup.querySearch = function(queryString) {
            var results = queryString
                ? R.filter(_createFilterFor(queryString), filterGroup.dataset)
                : [];

            return results;
        };

        filterGroup.addItem = function() {
            if (filterGroup.selectedItem && (R.indexOf(filterGroup.selectedItem, filterGroup.appliedFilters) === -1)) {
                if (!filterGroup.appliedFilters.length) {
                    filterGroup.expand = true;
                }
                filterGroup.appliedFilters.push(filterGroup.selectedItem);
                filterGroup.onFilterListChanged({operation: 'add'});

                if (filterGroup.expand) {
                    $filterListDOM.scrollTopAnimated(filterListDOM.offsetHeight, 500).then(null, function(error) {
                        console.error(error);
                    });
                }
            }

            filterGroup.selectedItem = null;
        };

        filterGroup.removeItem = function(item) {
            var index = R.indexOf(item, filterGroup.appliedFilters);

            filterGroup.appliedFilters.splice(index, 1);
            filterGroup.onFilterListChanged({operation: 'remove'});
            if (!filterGroup.appliedFilters.length && filterGroup.expand) {
                filterGroup.expand = false;
            }
        };

        function _createFilterFor(queryString) {
            var lowerQueryString = angular.lowercase(queryString);
            return function filterFunction(filter) {
                if (R.indexOf(lowerQueryString, angular.lowercase(filter)) !== -1) {
                    if (R.indexOf(filter, filterGroup.appliedFilters) === -1) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            };
        }
    }
]);
