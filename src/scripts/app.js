'use strict';

angular.module('FoodTruck', ['ngRoute', 'ngMaterial']);

angular.module('FoodTruck').config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'src/views/home.html',
            controller: 'HomeController',
            controllerAs: 'home'
        }).otherwise({redirectTo: '/home'});
    }
]);
