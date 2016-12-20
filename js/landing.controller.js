(function() {
  'use strict';
  angular
    .module('Travelbucket')
    .controller('LandingController', LandingController);

  LandingController.$inject = ['authService', '$state'];

  function LandingController(authService, $state) {
    // is a user is logged in, prevent from reaching landing page; new 'root' is trips index
    if(authService.isLoggedIn()) {
      $state.go('tripsIndex');
    }
  }
}());
