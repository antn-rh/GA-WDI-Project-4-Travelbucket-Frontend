(function() {
  'use strict';
  angular
    .module('Travelbucket', ['ui.router', 'satellizer', 'ngResource', 'ngMap', 'ngMaterial'])
    .config(TripRouter)
    .config(AuthProvider)
    .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('red')
        .warnPalette('indigo');
    })
    .run(function ($rootScope, $state, authService) {
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        // if user isn’t authenticated...
        if (toState.authenticate && !authService.isLoggedIn()){
          $state.transitionTo('index');
          event.preventDefault();
        }
      });
    });

  AuthProvider.$inject = ['$authProvider'];

  function TripRouter($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'landing.html',
        controller: 'LandingController',
        authenticate: false
      })
      .state('signin', {
        url: '/signin',
        templateUrl: 'signin.html',
        controller: 'SignInController',
        controllerAs: 'vm',
        authenticate: false
      })
      .state('about', {
        url: '/about',
        templateUrl: 'about.html',
        authenticate: true
      })
      .state('tripsIndex', {
        url: '/trips',
        templateUrl: 'trips.index.html',
        controller: 'TripsListController',
        controllerAs: 'tripListVm',
        authenticate: true
      })
      .state('tripsNew', {
        url: '/trips/new',
        templateUrl: 'trips.new.html',
        controller: 'TripsNewController',
        controllerAs: 'tripNewVm',
        authenticate: true
      })
      .state('tripsShow', {
        url: '/trips/show/:id',
        templateUrl: 'trips.show.html',
        controller: 'TripsShowController',
        controllerAs: 'tripShowVm',
        authenticate: true
      })
      .state('tripsEdit', {
        url: '/trips/edit/:id',
        templateUrl: 'trips.edit.html',
        controller: 'TripsEditController',
        controllerAs: 'tripEditVm',
        authenticate: true
      });
  }

  function AuthProvider($authProvider) {
    $authProvider.google({
      clientId: '1055578100655-vov0la7q2vr9acqesmj5dvb5t9fv14tp.apps.googleusercontent.com',
      url: 'http://localhost:3000/auth/google'
    });
  }
}());
