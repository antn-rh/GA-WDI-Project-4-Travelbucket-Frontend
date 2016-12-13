(function() {
  "use strict";
  angular
    .module('Travelbucket')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$log', 'authService', '$http'];

  function NavbarController($log, authService, $http) {
    var vm = this;
    vm.userName = '';
    vm.getUser = getUser;
    vm.authService = authService;

    $log.info('NavbarController loaded!');

    function getUser() {
      $http.get('http://localhost:3000/api/me').then(function(response) {
        console.log(response.data);
        console.log(response.data.data.name)
        vm.userName = response.data.data.name;
      });
    }
    getUser();
  }
})();
