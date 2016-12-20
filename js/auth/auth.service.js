(function() {
  'use strict';
  angular
    .module('Travelbucket')
    .factory('authService', authService);

  authService.$inject = ['$log', 'tokenService', '$http', '$state'];

  function authService($log, token, $http, $state) {
    $log.info('auth service loaded!');

    var service = {
      logIn: logIn,
      isLoggedIn: isLoggedIn,
      logOut: logOut,
      currentUser: currentUser
    }
    return service;

    function isLoggedIn() {
      return (token.retrieve() != null);
    }

    function logIn(data) {
      var promise = $http({
        method: 'POST',
        url: 'http://localhost:3000/api/token',
        data: data
      }).then(
        // if the req succeeded, run this handler and pass the decoded token
        function(res) {
          token.store(res.data);
          return token.decode();
        }
        // since there is no error handler, pass an error onto the next promise, without calling the above success handler
      );
      return promise;
    }

    function logOut() {
      window.location.reload();
      token.destroy();
      $state.go('index');
    }

    function currentUser() {
      if(isLoggedIn()) {
        return token.decode();
      } else {
        return false;
      }
    }
  }
}());
