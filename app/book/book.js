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


    .controller('BookCtrl', ['$scope', '$http', '$stateParams', '$state', '$rootScope', 'SharedState',
        function($scope, $http, $stateParams, $state, $rootScope, SharedState) {


        $scope.topics = null;
        $rootScope.menuVisible = true;

        $scope.openCourse= function (course) {
            console.log("nesto", course);
            $state.go('modal', {course_name: course.name, course_id:course.id, course_time_from:course.time_from, course_time_to:course.time_to });

        }

        $http.get('course.json').then(function(response){
            response.data.topics.forEach(function(topic){
                if (topic.id == $stateParams.id){
                    $scope.topic = topic;
                    console.log($scope.topic.courses);
                }
            });
        });

        $scope.updateActive = function (active) {
            console.log(active);
        }


        /*
        $scope.topics = topics;
        console.log($scope.topics);
        */

    }]);

