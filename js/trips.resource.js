(function() {
  'use strict';
  angular
    .module('Travelbucket')
    .factory('TripsResource', TripsResource);

  TripsResource.$inject = ['$resource'];

  function TripsResource($resource) {
    return $resource('http://localhost:3000/api/trips/:id', {id: '@_id'}, {
      'update': {method: 'PATCH'}
    });
  }
}());
