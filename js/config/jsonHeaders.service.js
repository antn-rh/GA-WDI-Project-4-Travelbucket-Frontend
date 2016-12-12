
(function() {
  "use strict";

  angular
    .module("Travelbucket")
    .factory("jsonHeadersService", jsonHeadersService);

  jsonHeadersService.$inject = ["$log"];

  function jsonHeadersService($log) {
    return {
      request: addJsonHeaders
    };

    function addJsonHeaders(request) {
      $log.debug("Setting JSON headers.");
      request.headers['Content-Type'] = 'application/json';
      return request;
    }
  }

})();
