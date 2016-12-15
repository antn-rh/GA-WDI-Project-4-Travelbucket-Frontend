(function() {
  'use strict';
  angular
    .module('Travelbucket')
    .controller('TripsListController', TripsListController)
    .controller('TripsNewController', TripsNewController)
    .controller('TripsShowController', TripsShowController)
    .controller('TripsEditController', TripsEditController)

  TripsListController.$inject = ['TripsResource', 'authService'];
  TripsNewController.$inject = ['TripsResource', '$state'];
  TripsShowController.$inject = ['TripsResource', '$stateParams', '$state', '$http'];
  TripsEditController.$inject = ['TripsResource', '$state', '$stateParams'];

  function TripsListController(TripsResource, authService) {
    var vm = this;
    vm.trips = [];
    vm.currentUser = authService.currentUser();

    TripsResource.get().$promise.then(function(data) {
      vm.trips = data.trips;
    });
  }

  function TripsNewController(TripsResource, $state) {
    var vm = this;
    vm.newTrip = {};
    vm.addTrip = addTrip;

    function addTrip() {
      if(vm.newTrip.bookmarks && typeof vm.newTrip.bookmarks === 'string') {
        vm.newTrip.bookmarks = vm.newTrip.bookmarks.split(',');
      }

      TripsResource.save(vm.newTrip).$promise.then(function(jsonTrip) {
        vm.newTrip = {};
        $state.go('tripsIndex');
      });
    }
  }

  function TripsShowController(TripsResource, $stateParams, $state, $http) {
    var vm = this;
    vm.trip = {};
    vm.deleteTrip = deleteTrip;
    vm.getYelp = getYelp;
    // vm.searchResults is an array of coordinates based on a search
    vm.searchResults = [];

    TripsResource.get({id: $stateParams.id}).$promise.then(function(jsonTrip) {
      vm.trip = jsonTrip;
      console.log(vm.trip);
    });

    function deleteTrip() {
      TripsResource.delete({id: $stateParams.id}).$promise.then(function(response) {
        if(response.message) {
          console.log(response.message);
        }
      });
      $state.go('tripsIndex');
    }

    function getYelp() {
      $http({
        method: 'POST',
        // change this url when you deploy
        url: 'http://localhost:3000/api/yelp',
        data: {
          searchTerm: vm.searchTerm,
          latitude: vm.trip.latitude,
          longitude: vm.trip.longitude
        }
      }).then(function(response) {
        // set vm.searchresponse = data.something then make marker
        vm.searchResults = [];
        for(var i = 0; i < response.data.businesses.length; i++) {
          vm.searchResults.push(response.data.businesses[i].coordinates)
        }
      });
    }
  }

  function TripsEditController(TripsResource, $state, $stateParams) {
    var vm = this;
    vm.trip = {};
    vm.updateTrip = updateTrip;

    TripsResource.get({id: $stateParams.id}).$promise.then(function(jsonTrip) {
      vm.trip = jsonTrip;
    });

    function updateTrip() {
      if(vm.trip.bookmarks && typeof vm.trip.bookmarks === 'string') {
        vm.trip.bookmarks = vm.trip.bookmarks.split(',');
      }

      TripsResource.update(vm.trip).$promise.then(function(editedTrip) {
        vm.trip = editedTrip;
        $state.go('tripsIndex');
      })
    }
  }
}());
