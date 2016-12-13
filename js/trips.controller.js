(function() {
  'use strict';
  angular
    .module('Travelbucket')
    .controller('TripsListController', TripsListController)
    .controller('TripsNewController', TripsNewController)
    .controller('TripsShowController', TripsShowController)
    .controller('TripsEditController', TripsEditController)

  TripsListController.$inject = ['TripsResource'];
  TripsNewController.$inject = ['TripsResource', '$state'];
  TripsShowController.$inject = ['TripsResource', '$stateParams'];
  TripsEditController.$inject = ['TripsResource', '$state', '$stateParams'];

  function TripsListController(TripsResource) {
    var vm = this;
    vm.trips = [];
    vm.deleteTrip = deleteTrip;

    TripsResource.get().$promise.then(function(data) {
      console.log(data.trips);
      vm.trips = data;
    });

    function deleteTrip(tripToDelete) {
      TripResource.delete({id: tripToDelete._id}).$promise.then(function(response) {
        if(response.message) {
          console.log(response.message);
          vm.trips = vm.trips.filter(function(trip) {
            return trip != tripToDelete;
          });
        }
      });
    }
  }

  function TripsNewController(TripsResource, $state) {
    var vm = this;
    vm.newTrip = {};
    vm.addTrip = addTrip;

    function addTrip() {
      TripsResource.save(vm.newTrip).$promise.then(function(jsonTrip) {
        vm.newTrip = {};
        $state.go('tripsIndex');
      });
    }
  }

  function TripsShowController(TripsResource, $stateParams) {
    var vm = this;
    vm.trip = {};

    TripsResource.get({id: $stateParams.id}).$promise.then(function(jsonTrip) {
      vm.trip = jsonTrip;
    });
  }

  function TripsEditController(TripsResource, $state, $stateParams) {
    var vm = this;
    vm.trip = {};
    vm.updateTrip = updateTrip

    TripsResource.get({id: $stateParams.id}).$promise.then(function(jsonTrip) {
      vm.trip = jsonTrip;
    });

    function updateTrip() {
      TripsResource.update(vm.trip).$promise.then(function(editedTrip) {
        vm.trip = editedTrip;
        $state.go('tripsIndex');
      })
    }
  }
}());
