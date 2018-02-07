angular.module('tbbc.main', ['ngRoute', 'ui.router'])

    .config(['$routeProvider', '$stateProvider', function ($routeProvider, $stateProvider) {

        $stateProvider
            .state('menu', {
                url: '/menu',
                templateUrl: 'app/menu/menu.html',
                controller: 'MainCtrl',
                resolve: {
                    topics: function($http){
                        return $http.get('course.json').then(function(response){
                            return response.data.topics;
                        });
                    }
                }
            });

    }])


.controller('MainCtrl', ['$scope', 'topics', function($scope, topics) {

    $scope.test = "Michael";
    $scope.test = function(index){}

    $scope.topics = topics;
    console.log($scope.topics);

}]);