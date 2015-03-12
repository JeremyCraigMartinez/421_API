'use strict';

angular.module('popcornApp.controllers')
.controller('LoginController', 
  function($scope, $location, UserService) {
    $scope.signup = {};
    $scope.login = {};

    UserService.currentUser().then(function(user) {
    	$scope.user = user;
    });

    $scope.submitSignup = function() {
      UserService.login($scope.signup.email).then(function(user) {
        console.log(user);
        $scope.user = user;
        $location.path('/');
      });
    };

    $scope.submitLogin = function() {
      UserService.login($scope.login.email).then(function(user) {
        console.log(user);
        $scope.user = user;
        $location.path('/');
      });
    };
});