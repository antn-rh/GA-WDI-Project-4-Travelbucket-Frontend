(function() {
  "use strict";
  angular
    .module('Travelbucket')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$log', 'authService', '$http'];

  function NavbarController($log, authService, $http) {
    var vm = this;
    vm.userName = authService.currentUser().name;
    vm.authService = authService;

    $log.info('NavbarController loaded!');
  }
})();
