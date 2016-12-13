(function() {
  'use strict';
  angular
    .module('Travelbucket')
    .controller('TripsController', TripsController);

  TripsController.$inject = ['$log', '$state', 'TripsResource'];

  function TripsController($log, $state, TripsResource) {
    
  }

}());
