(function() {
  'use strict';
  angular
    .module('Travelbucket')
    .controller('LandingController', LandingController);

  LandingController.$inject = ['authService', '$state'];

  function LandingController(authService, $state) {
    if(authService.isLoggedIn()) {
      $state.go('tripsIndex');
    }
  }
}());
