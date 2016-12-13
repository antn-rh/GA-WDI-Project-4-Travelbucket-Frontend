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
      })
      .state('signin', {
        url: '/signin',
        templateUrl: 'signin.html',
        controller: 'SignInController',
        controllerAs: 'vm'
      });
  }

  function AuthProvider($authProvider) {
    $authProvider.google({
      clientId: '1055578100655-vov0la7q2vr9acqesmj5dvb5t9fv14tp.apps.googleusercontent.com',
      url: 'http://localhost:3000/auth/google'
    });
  }
}());
