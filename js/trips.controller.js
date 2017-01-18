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
  TripsShowController.$inject = ['TripsResource', '$stateParams', '$state', '$http', 'NgMap', '$sce', '$scope', '$mdDialog'];
  TripsEditController.$inject = ['TripsResource', '$state', '$stateParams'];

//
// TRIPS LIST CONTROLLER
//
  function TripsListController(TripsResource, authService) {
    var vm = this;
    vm.trips = [];
    vm.currentUser = authService.currentUser();

    TripsResource.get().$promise.then(function(data) {
      vm.trips = data.trips;
    });
  }

//
// TRIPS NEW CONTROLLER
//
  function TripsNewController(TripsResource, $state) {
    var vm = this;
    vm.newTrip = {};
    // there is currently a console error about the instance of the datepicker, the code below might help
    // vm.startDate = new Date();
    // vm.endDate = new Date();
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

//
// TRIPS SHOW CONTROLLER
//
  function TripsShowController(TripsResource, $stateParams, $state, $http, NgMap, $sce, $scope, $mdDialog) {
    var vm = this;
    // for google calendar api
    vm.handleAuthClick = handleAuthClick;
    vm.events = [];
    vm.authorized = false;
    vm.calendars = [];
    vm.startDay = new Date();
    vm.getCalendarEvents = getCalendarEvents;
    vm.createCalendarEvent = createCalendarEvent;
    vm.createEventDialog = createEventDialog;
    vm.eventHours = ["00:00", "00:15", "00:30", "00:45",
    "01:00", "01:15", "01:30", "01:45",
    "02:00", "02:15", "02:30", "02:45",
    "03:00", "03:15", "03:30", "03:45",
    "04:00", "04:15", "04:30", "04:45",
    "05:00", "05:15", "05:30", "05:45",
    "06:00", "06:15", "06:30", "06:45",
    "07:00", "07:15", "07:30", "07:45",
    "08:00", "08:15", "08:30", "08:45",
    "09:00", "09:15", "09:30", "09:45",
    "10:00", "10:15", "10:30", "10:45",
    "11:00", "11:15", "11:30", "11:45",
    "12:00", "12:15", "12:30", "12:45",
    "13:00", "13:15", "13:30", "13:45",
    "14:00", "14:15", "14:30", "14:45",
    "15:00", "15:15", "15:30", "15:45",
    "16:00", "16:15", "16:30", "16:45",
    "17:00", "17:15", "17:30", "17:45",
    "18:00", "18:15", "18:30", "18:45",
    "19:00", "19:15", "19:30", "19:45",
    "20:00", "20:15", "20:30", "20:45",
    "21:00", "21:15", "21:30", "21:45",
    "22:00", "22:15", "22:30", "22:45",
    "23:00", "23:15", "23:30", "23:45", "24:00"
    ]

    // for overall functionality of the trips show page
    vm.trip = {};
    vm.deleteTrip = deleteTrip;
    vm.getYelp = getYelp;
    vm.searchResults = [];
    vm.pinClicked = pinClicked;
    vm.infoWindow = infoWindow;
    vm.addToBookmarks = addToBookmarks;
    vm.removeBookmark = removeBookmark;
    vm.searchAddress = searchAddress;

    var CLIENT_ID = '1055578100655-vov0la7q2vr9acqesmj5dvb5t9fv14tp.apps.googleusercontent.com';
    var SCOPES = ["https://www.googleapis.com/auth/calendar"];

    function handleAuthResult(authResult) {
      // big issue: when i sign in and authorize a calendar, signing in to a diff acc loads the same cal
      if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        vm.authorized = true;
        $scope.$apply();
        loadCalendarApi();
      } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        vm.authorized = false;
      }
    }

    function handleAuthClick(event) {
      gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
        handleAuthResult);
      return false;
    }

    /**
     * Load Google Calendar client library. List upcoming events
     * once client library is loaded.
     */
    function loadCalendarApi() {
      gapi.client.load('calendar', 'v3', getCalendars);
    }

    function getCalendars() {
      var request = gapi.client.calendar.calendarList.list();
      request.execute(function(res) {
        vm.calendars = res.items;
        $scope.$apply();
      })
    }

    function getCalendarEvents() {
      var request = gapi.client.calendar.events.list({
        'calendarId': vm.selectedCal,
        'timeMin': vm.startDay.toISOString(),
        'timeMax': vm.endDay.toISOString(),
        'showDeleted': false,
        'singleEvents': true
      });

      request.execute(function(res) {
        //issue where events don't show if event is on end date
        vm.events = res.items.sort(function(a,b) {
          return new Date(a.start.dateTime || a.start.date) - new Date(b.start.dateTime || b.start.date);
        }).map(function(event) {
          return {
            date: (event.start.dateTime || event.start.date),
            endTime: (event.end.dateTime || event.end.date),
            link: event.htmlLink,
            organizer: event.organizer.displayName || event.organizer.email,
            startTime: (event.start.dateTime || event.start.date),
            summary: event.summary
          }
        });
        $scope.$apply();
      });
    }

    function createEventDialog(ev) {
      if(vm.selectedCal == null) {
        angular.element(document.querySelector('#open-event-form-button')).parent().append("<p style='font-weight: bold; font-size: 14px' id='select-cal-warning'>Please select a calendar.</p>");
      } else {
        angular.element(document.querySelector('#select-cal-warning')).html('');
        $mdDialog.show({
          controller: TripsShowController,
          contentElement: '#event-dialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        });
      }
    };

    function createCalendarEvent() {
      var event = {
        'summary': vm.summary,
        'location': vm.location,
        'description': vm.description,
        'start': {
          'dateTime': new Date((vm.startDateTime).toString().split('').slice(0, 15).join('') + ' @ ' + vm.startHour),
          'timeZone': 'America/Los_Angeles'
        },
        'end': {
          'dateTime': new Date((vm.endDateTime).toString().split('').slice(0, 15).join('') + ' @ ' + vm.endHour),
          'timeZone': 'America/Los_Angeles'
        },
        'attendees': [],
        'reminders': {
          'useDefault': false
        }
      };
      console.log(event.start.dateTime);
      console.log(event.end.dateTime);

      // '2017-01-21T09:00:00-10:00'

      var request = gapi.client.calendar.events.insert({
        'calendarId': vm.selectedCal,
        'resource': event
      });

      request.execute(function(event) {
        $mdDialog.hide();
        // alert('Event created: ' + event.htmlLink);
      });
    }

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
      // needs some finetuning. search is quite limited, only completes search within a certain radius (lat/long)
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

    function removeBookmark(bookmark) {
      vm.trip.bookmarks.splice(vm.trip.bookmarks.indexOf(bookmark), 1);

      TripsResource.update(vm.trip).$promise.then(function(updatedBookmarks) {
        vm.trip = updatedBookmarks;
      });
    }

    function searchAddress() {
      var address = vm.trip.lodgingAddress.split(' ').join('+');
      window.open(`https://www.google.com/search?q=${address}`);
    }
  }

//
// TRIPS EDIT CONTROLLER
//
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
