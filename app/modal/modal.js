angular.module('tbbc.modal', ['ngRoute', 'ui.router'])

    .config(['$routeProvider', '$stateProvider', function ($routeProvider, $stateProvider) {

        $stateProvider
            .state('modal', {
                url: '/modal/:course_name/:course_id',
                templateUrl: 'app/modal/modal.html',
                controller: 'ModalCtrl',

            });

    }])


    .controller('ModalCtrl', ['$scope', '$http', '$stateParams', '$state', '$timeout',
        function($scope, $http, $stateParams, $state, $timeout) {


        var id = $stateParams.id;
        console.log("ID", id);

        $scope.user1=localStorage.getItem("user");

        $scope.user2=JSON.parse($scope.user1);

        $scope.topics = null;

        $scope.course = {
            name: $stateParams.course_name,
            id: $stateParams.course_id
        };

        $scope.showLoader=false;

        $scope.loader = function() {
            $scope.showLoader=true;
            $timeout(function () {
                $scope.showLoader = false;
                $state.go('menu');
            }, 5000)

        };


    }]);