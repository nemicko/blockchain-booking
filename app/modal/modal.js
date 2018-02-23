angular.module('tbbc.modal', ['ngRoute', 'ui.router'])

    .config(['$routeProvider', '$stateProvider', function ($routeProvider, $stateProvider) {

        $stateProvider
            .state('modal', {
                url: '/modal/:course_name/:course_id/:course_time_from/:course_time_to',
                templateUrl: 'app/modal/modal.html',
                controller: 'ModalCtrl',

            });

    }])


    .controller('ModalCtrl', ['$scope', '$http', '$stateParams', '$state', '$timeout', '$interval',
        function ($scope, $http, $stateParams, $state, $timeout, $interval) {

            var id = $stateParams.id;
            console.log("ID", id);
            $scope.flag=1;

            $scope.publicKey = localStorage.getItem("publicKey");
            $scope.publicKey = JSON.parse($scope.publicKey);

            $scope.username = localStorage.getItem("username");

            $scope.topics = null;

            $scope.course = {
                name: $stateParams.course_name,
                id: $stateParams.course_id,
                time_from: $stateParams.course_time_from,
                time_to: $stateParams.course_time_to
            };

            $scope.showLoader = false;
            $scope.showText = false;

            $scope.loader = function (course_id) {
                var transaction = {
                    from: "2288c4b3e0dbb47ba24ceac2a2fcc766",
                    to: $scope.publicKey,
                    course: course_id
                };
                var books = JSON.parse(localStorage.getItem("bookings"));
                if (!books)
                    books = [];
                books.push(transaction);

                localStorage.setItem("bookings", JSON.stringify(books));
                console.log("bookings", books);

                if (socket) {
                    socket.emit("transaction", transaction);
                }

                $scope.showLoader = true;
                $scope.showText = true;
                $timeout(function () {
                    $state.go('menu');
                }, 10000);

                $scope.state = 1;

                $interval(function () {
                    $scope.state++;
                    /*if ($scope.state==3) {
                        $scope.flag = 1;
                    }*/
                    console.log($scope.state);
                }, 3000, 3);

            };

        }]);