'use strict';

angular.module('FoodTruck').constant('API', {
    URL: 'https://data.sfgov.org/resource/6a9r-agq8.json',
    APP_TOKEN: 'XicjIEaGOJI8nkdh4mjF3EAPS'
});

angular.module('FoodTruck').constant('MAP_ICON', {
    TRUCK_MARKER: 'assets/images/truck-marker.svg',
    LOCATION_MARKER: 'assets/images/location-marker.svg'
});

angular.module('FoodTruck').constant('ERROR_LOCATION', {
    lat: 25.0000,
    lng: -71.0000,
    name: 'Middle of Nowhere, Nowhere'
});
