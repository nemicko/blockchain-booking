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
        function($scope, $http, $stateParams, $state, $timeout, $interval) {


        var id = $stateParams.id;
        console.log("ID", id);

        $scope.user=localStorage.getItem("user");

        $scope.user=JSON.parse($scope.user);

        $scope.topics = null;

        $scope.course = {
            name: $stateParams.course_name,
            id: $stateParams.course_id,
            time_from: $stateParams.course_time_from,
            time_to: $stateParams.course_time_to
        };

        $scope.showLoader=false;
        $scope.showText=false;


        $scope.loader = function(course_id) {
            var transaction = {
                from:"",
                to: $scope.user.code,
                course: course_id
            };
            var books = JSON.parse(localStorage.getItem("bookings"));
            if(!books)
                books = [];
            books.push(transaction);

            localStorage.setItem("bookings",JSON.stringify(books));
            console.log("bookings",books);

            window.addBlock = function(){
                var block = {
                    previous: window.chain.last().index,
                    data: ["My block"],
                    client: "clientA",
                    timestamp: new Date(),
                    index: window.chain.last().index + 1
                };
                socket.emit("add", block);
            }

            $scope.showLoader=true;
            $scope.showText=true;
            $timeout(function () {
                $state.go('menu');
            }, 10000);

            $scope.state=0;

            $interval(function() {

                    $scope.state++;
                    console.log($scope.state);

            }, 3000,3);





        };




    }]);