angular.module('tbbc.main', ['ngRoute', 'ui.router'])

    .config(['$routeProvider', '$stateProvider', function ($routeProvider, $stateProvider) {

        $stateProvider
            .state('menu', {
                url: '/menu',
                templateUrl: 'app/menu/menu.html',
                controller: 'MainCtrl'
            });

    }])

    .controller('MainCtrl', ['$routeParams', '$rootScope', '$window', '$scope', '$state',
        function ($routeParams, $rootScope, $window, $scope, $state) {

            console.log("test");

        }
    ]);