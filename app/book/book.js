angular.module('tbbc.book', ['ngRoute', 'ui.router'])

    .config(['$routeProvider', '$stateProvider', function ($routeProvider, $stateProvider) {

        $stateProvider
            .state('book', {
                url: '/book/:id?',
                templateUrl: 'app/book/book.html',
                controller: 'BookCtrl',
                resolve: {
                    /*
                    topics: function($http){
                        return $http.get('course.json').then(function(response){
                            return response.data.topics;
                        });
                    }*/
                }
            });

    }])


    .controller('BookCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {

        $scope.topics = null;

        $http.get('course.json').then(function(response){
            response.data.topics.forEach(function(topic){
                if (topic.id == $stateParams.id){
                    $scope.topic = topic;
                    console.log($scope.topic.courses);
                }
            });
        });



        /*
        $scope.topics = topics;
        console.log($scope.topics);
        */

    }]);

