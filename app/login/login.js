angular.module('tbbc.login', ['ngRoute', 'ui.router'])

    .config(['$routeProvider', '$stateProvider', function ($routeProvider, $stateProvider) {

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'LoginCtrl',

            });

    }])


    .controller('LoginCtrl', ['$scope', '$http', '$stateParams', '$state', function($scope, $http, $stateParams, $state) {

        $scope.login=function(){

            localStorage.setItem("user",JSON.stringify($scope.user));
            $scope.createWallet($scope.user).then(function (res) {
                console.log("user",$scope.user);
                console.log("succeeded",res);
                if(res){
                    $state.go("menu");
                }
            })
        }

        $scope.createWallet = function(user){
            return new Promise(function (resolve, reject){
                if(user){
                    resolve(true);
                    return;
                }
                reject(false);

            })

        }

    }]);