angular.module('tbbc.bookings', ['ngRoute', 'ui.router'])

    .config(['$routeProvider', '$stateProvider', function ($routeProvider, $stateProvider) {

        $stateProvider
            .state('bookings', {
                url: '/bookings',
                templateUrl: 'app/bookings/bookings.html',
                controller: 'BookingsCtrl'
            });

    }])

    .controller('BookingsCtrl', ['$scope', '$http', '$stateParams', '$state', function($scope, $http, $stateParams, $state) {


    }]);