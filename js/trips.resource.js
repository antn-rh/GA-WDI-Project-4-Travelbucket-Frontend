(function() {
  'use strict';
  angular
    .module('Travelbucket')
    .factory('TripsResource', TripsResource);

  TripsResource.$inject = ['$resource'];

  function TripsResource($resource) {
    return $resource('https://travelbucket-api.herokuapp.com/api/trips/:id', {id: '@_id'}, {
      'update': {method: 'PATCH'}
    });
  }
}());
