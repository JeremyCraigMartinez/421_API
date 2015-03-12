angular.module('popcornApp.controllers')
	.controller('MoviesController',
		function($scope, MoviesService){
			console.log("loading");

      $scope.movies = MoviesService.movies();

      MoviesService.movies().then(function(movies){
      	$scope.movies = movies;
      });

			$scope.addFavorite = function(movie){
				movie.isFavorite = true;
			};

			$scope.removeFavorite = function(movie){
				movie.isFavorite = false;
			};
		});