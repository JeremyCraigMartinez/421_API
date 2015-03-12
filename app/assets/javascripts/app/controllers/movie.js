angular.module('popcornApp.controllers')
	.controller('MovieController', 
		function($scope, MoviesService, $routeParams, $sce){
		console.log('MovieController is booting');

		MoviesService.movies().then(function(movies){
			$scope.movies = movies;
			$scope.movie = _.find($scope.movies, function(v){
				return v.youtubeId == $routeParams.movie_id;
			});
			$scope.movie.youtubeUrl = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + $scope.movie.youtubeId + "?rel=0");
		})
	});
