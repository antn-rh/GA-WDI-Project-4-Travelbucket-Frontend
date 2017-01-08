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
  TripsShowController.$inject = ['TripsResource', '$stateParams', '$state', '$http', 'NgMap', '$sce'];
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
    vm.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function(state) {
        return {abbrev: state};
      });

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

  function TripsShowController(TripsResource, $stateParams, $state, $http, NgMap, $sce) {
    var vm = this;
    vm.trip = {};
    vm.deleteTrip = deleteTrip;
    vm.getYelp = getYelp;
    vm.searchResults = [];
    vm.pinClicked = pinClicked;
    vm.infoWindow = infoWindow;
    vm.addToBookmarks = addToBookmarks;

    TripsResource.get({id: $stateParams.id}).$promise.then(function(jsonTrip) {
      vm.trip = jsonTrip;
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
        vm.searchResults = [];
        console.log(response.data)
        for(var i = 0; i < response.data.businesses.length; i++) {
            vm.searchResults.push(response.data.businesses[i]);
        }
      });
    }

    NgMap.getMap({id: 'google-map'}).then(function(map) {
      vm.map = map;
    });

    function pinClicked(e, searchQuery) {
      vm.windowContent = searchQuery;
      vm.map.showInfoWindow('resultPin', searchQuery.id);
    };

    function infoWindow() {
      return $sce.trustAsHtml(
        '<h3 style="font-weight: bold">' + vm.windowContent.name + '</h3>' +
        '<p>' + 'Category: ' + vm.windowContent.categories[0].title + '</p>' +
        '<p>' + vm.windowContent.location.address1 + ' ' + vm.windowContent.location.city + ', ' + vm.windowContent.location.state + ' ' + vm.windowContent.location.zip_code + '</p>' +
        '<p>' + vm.windowContent.price + ', ' + vm.windowContent.rating+ ' &#9734, ' + 'Reviews: ' + vm.windowContent.review_count + '</p>' +
        `<a href=${vm.windowContent.url} target="_blank">Yelp Link</a>`
      );
    }

    function addToBookmarks() {
      if(!vm.trip.bookmarks.includes(vm.text)) {
        vm.trip.bookmarks.push(vm.text);
        vm.text = null;
      }

      TripsResource.update(vm.trip).$promise.then(function(addedBookmark) {
        vm.trip = addedBookmark;
      });
    }
  }

  function TripsEditController(TripsResource, $state, $stateParams) {
    var vm = this;
    vm.trip = {};
    vm.updateTrip = updateTrip;
    vm.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function(state) {
        return {abbrev: state};
      });

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
      });
    }
  }
}());
