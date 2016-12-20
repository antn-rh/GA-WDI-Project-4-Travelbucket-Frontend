(function() {
  "use strict";

  angular
    .module('Travelbucket')
    .controller('SignInController', SignInController);

  SignInController.$inject = ['$log', 'authService', 'userService', '$state', '$auth', '$window'];

  function SignInController($log, authService, userService, $state, $auth, $window) {
    var vm = this;

    // BINDINGS
    vm.signUp = {
      email: '',
      name: '',
      password: '',
      passwordConfirmation: ''
    };
    vm.submitSignUp = submitSignUp;
    vm.logIn = {
      email: '',
      password: ''
    };
    vm.submitLogIn = submitLogIn;
    vm.conflict = false;
    vm.authenticate = authenticate;

    // FUNCTIONS
    function submitSignUp() {
      userService
        .create(vm.signUp)
        .then(function(res) {
          return authService.logIn(vm.signUp);
        })
        .then(
          // on success
          function(decodedToken) {
            $log.info('Logged in!', decodedToken);
            $state.go('tripsIndex');
          },
          // on error
          function(err) {
            if (err.status === 409) vm.conflict = true;
            $log.info('Error Claire-r:', err);
          }
        );
    }

    function submitLogIn() {
      authService
        .logIn(vm.logIn)
        .then(
          // on success
          function(decodedToken) {
            $log.info('Logged in!', decodedToken);
            $state.go('tripsIndex');
          },
          // on error
          function(err) {
            $log.info('Error:', err);
          }
        );
    }

    $log.info('SignInController loaded!');

    function authenticate(provider) {
      $auth.authenticate(provider).then(
        function() {
          $state.go('tripsIndex');
        }
      )
    }
  }
})();
