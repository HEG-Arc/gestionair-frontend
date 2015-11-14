'use strict';

/**
 * @ngdoc function
 * @name gestionairFrontendApp.controller:ScoresCtrl
 * @description
 * # ScoresCtrl
 * Controller of the gestionairFrontendApp
 */
angular.module('gestionairFrontendApp')
  .controller('ScoresCtrl', function (api) {
    var scores = this;
    scores.api = api;
  });
