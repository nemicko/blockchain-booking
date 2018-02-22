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


        $scope.bookings = JSON.parse(localStorage.getItem("bookings"));

        $scope.topics = [];

        $http.get('course.json').then(function(response){
            $scope.topics = response.data.topics;

            $scope.bookings.forEach(function(booking) {
                var course = $scope.findCourse(booking.course);
                booking.course = course;
            });
        });

        $scope.findCourse = function(courseId){
            var _course = null;
            $scope.topics.forEach(function(topic){
                topic.courses.forEach(function(course){
                    if (course.id == courseId){
                        _course = course;
                    }
                });
            });
            return _course;
        }


    }]);