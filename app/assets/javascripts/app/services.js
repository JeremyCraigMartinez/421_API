angular.module('popcornApp.services', [])
  .service('MoviesService', 
    function($http, $q) {
      this.movies = function(name) {
        var d = $q.defer();
        $http({method: 'GET', url: 'http://gdata.youtube.com/feeds/api/charts/movies/most_popular?v=2&max-results=12&paid-content=true&hl=en&region=us&alt=json'}).
        then(function(response) {
          var movies = _.map(response.data.feed.entry, function(movie){
            return {
                youtubeId: movie['media$group']['yt$videoid']['$t'],
                title: movie['media$group']['media$title']['$t'], 
                released: movie['yt$firstReleased']['$t'].match(/\d{4}/)[0],
                rated: movie['media$group']['media$rating'][0]['$t'],
                runningTime: Math.round(movie['media$group']['yt$duration']['seconds'] / 60),
                posterUrl: _.findWhere(movie['media$group']['media$thumbnail'], {"yt$name": "poster"}).url,
                description: movie['media$group']['media$description']['$t']
              };
          });
          console.log(movies);
          d.resolve(movies);
        },
        function(error){
          d.reject(error);
        });
        return d.promise;
      }
    }
  )
  .service('UserService', 
     function($q, $cookieStore, $rootScope) {
       var service = this;
       this._user = null;
       this.setCurrentUser = function(u) {
         service._user = u;
       };
       this.currentUser = function() {
         var d = $q.defer();
         if(service._user) {
          d.resolve(service._user);
         }
         else if ($cookieStore.get('user')) {
          service._user = $cookieStore.get('user');
          $rootScope.$broadcast("user:set", service._user);
          d.resolve(service._user);
         }
         else {
          d.resolve(null);
         }
         return d.promise;
       };
       this.login = function(email) {
         var d = $q.defer();
         var user = {
           email: email,
           id: 1
         };

         service.setCurrentUser(user);
         $cookieStore.put('user',user);
         $rootScope.$broadcast('user:set', user);

         d.resolve(user);
         return d.promise;
       };
       this.logout = function() {
         var d = $q.defer();
         service._user = null;
         $cookieStore.remove('user');
         $rootScope.$broadcast('user:unset');
         d.resolve();
         return d.promise;
       };
    }
  );