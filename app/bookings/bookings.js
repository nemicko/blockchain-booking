angular.module('tbbc.bookings', ['ngRoute', 'ui.router'])

    .config(['$routeProvider', '$stateProvider', function ($routeProvider, $stateProvider) {

        $stateProvider
            .state('bookings', {
                url: '/bookings',
                templateUrl: 'app/bookings/bookings.html',
                controller: 'BookingsCtrl'
            });

    }])

    .controller('BookingsCtrl', ['$scope', '$http', '$stateParams', '$state', '$rootScope',
        function($scope, $http, $stateParams, $state, $rootScope) {

        $scope.pending = JSON.parse(localStorage.getItem("bookings"));
        $scope.topics = [];
        $scope.publicKey = JSON.parse(localStorage.getItem("publicKey"));
        $scope.bookings = [];


        $http.get('course.json').then(function(response){
            $scope.topics = response.data.topics;

            $scope.pending.forEach(function(booking) {
                var course = $scope.findCourse(booking.course);
                booking.course = course;
                booking.pending = true;
            });

            $scope.bookings = $scope.pending;

            $rootScope.chain.forEach(function(block){
                block.transactions.forEach(function(transaction){
                    if (transaction.to == $scope.publicKey){
                        var course = $scope.findCourse(transaction.course);
                        transaction.course = course;
                        transaction.pending = false;
                        $scope.bookings.push(transaction);
                    }
                });
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