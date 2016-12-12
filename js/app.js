(function() {
  'use strict';
  angular
    .module('Travelbucket', ['ui.router'])
    .config(TripRouter);

  function TripRouter($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('index', {
        url: '/',
      })
      .state('signin', {
        url: '/signin',
        templateUrl: 'signin.html',
        controller: 'SignInController',
        controllerAs: 'vm'
      });
  }
}());
