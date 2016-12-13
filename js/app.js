(function() {
  'use strict';
  angular
    .module('Travelbucket', ['ui.router', 'satellizer'])
    .config(TripRouter)
    .config(AuthProvider)

  AuthProvider.$inject = ['$authProvider'];

  function TripRouter($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'landing.html'
      })
      .state('signin', {
        url: '/signin',
        templateUrl: 'signin.html',
        controller: 'SignInController',
        controllerAs: 'vm'
      })
      .state('tripsIndex', {
        url: '/trips',
        templateUrl: 'trips.index.html',
        controller: 'TripsListController',
        controllerAs: 'tripListVm'
      })
      .state('tripsNew', {
        url: '/trips/new',
        templateUrl: 'trips.new.html',
        controller: 'TripsNewController',
        controllerAs: 'tripNewVm'
      })
      .state('tripsShow', {
        url: '/trips/show/:id',
        templateUrl: 'trips.show.html',
        controller: 'TripsShowController',
        controllerAs: 'tripShowVm'
      })
      .state('tripsEdit', {
        url: '/trips/edit/:id',
        templateUrl: 'trips.edit.html',
        controller: 'TripsEditController',
        controllerAs: 'tripEditVm'
      });
  }
  // there is an issue where sign in with Google button redirects before authenticating

  function AuthProvider($authProvider) {
    $authProvider.google({
      clientId: '1055578100655-vov0la7q2vr9acqesmj5dvb5t9fv14tp.apps.googleusercontent.com',
      url: 'http://localhost:3000/auth/google'
    });
  }
}());
