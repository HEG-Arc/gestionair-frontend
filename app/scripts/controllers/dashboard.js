'use strict';

/**
 * @ngdoc function
 * @name gestionairFrontendApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the gestionairFrontendApp
 */
angular.module('gestionairFrontendApp')
  .controller('DashboardCtrl', function ( api ) {
    // display states of player in progress
    // display summary stats
    this.api = api;
    api.startSim();

  });
