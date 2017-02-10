'use strict';

angular.module('FoodTruck', ['ngRoute', 'ngMaterial', 'duScroll']);

angular.module('FoodTruck').config([
    '$routeProvider',
    '$mdThemingProvider',
    function($routeProvider, $mdThemingProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'src/views/home.html'
        }).otherwise({redirectTo: '/home'});

        $mdThemingProvider.theme('default').primaryPalette('light-green');
    }
]);

angular.module('FoodTruck').run([
    '$rootScope',
    function($rootScope) {
        $rootScope.requestQueue = [];
    }
]);
