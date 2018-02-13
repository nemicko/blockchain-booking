angular.module('tbbc.modal', ['ngRoute', 'ui.router'])

    .config(['$routeProvider', '$stateProvider', function ($routeProvider, $stateProvider) {

        $stateProvider
            .state('modal', {
                url: '/modal/:id?',
                templateUrl: 'app/modal/modal.html',
                controller: 'ModalCtrl',

            });

    }])


    .controller('ModalCtrl', ['$scope', '$http', '$stateParams', '$state', function($scope, $http, $stateParams, $state) {

        var id = $stateParams.id;
        console.log("ID", id);

        $scope.topics = null;

        $http.get('course.json').then(function(response){
            response.data.topics.forEach(function(topic){
                if (topic.id == $stateParams.id){
                    $scope.topic = topic;
                    console.log($scope.topic.courses);
                }
            });
        })

        $scope.loader = function() {

        };


    }]);