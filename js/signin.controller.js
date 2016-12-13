(function() {
  "use strict";

  angular
    .module('Travelbucket')
    .controller('SignInController', SignInController);

  SignInController.$inject = ['$log', 'authService', 'userService', '$state', '$auth'];

  function SignInController($log, authService, userService, $state, $auth) {
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
            $state.go('index');
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
            $state.go('index');
          },
          // on error
          function(err) {
            $log.info('Error:', err);
          }
        );
    }

    $log.info('SignInController loaded!');

    function authenticate(provider) {
      $auth.authenticate(provider)
      $state.go('index');
    }
  }
})();
