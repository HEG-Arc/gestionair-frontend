'use strict';

/**
 * @ngdoc function
 * @name gestionairFrontendApp.controller:OnboardingCtrl
 * @description
 * # OnboardingCtrl
 * Controller of the gestionairFrontendApp
 */
angular.module('gestionairFrontendApp')
  .controller('BoardingCtrl', function ($timeout) {
    var boarding = this;
    boarding.state = 'INIT';
    this.board = function () {
      boarding.state = 'INFO';
      //contact server
      //display info with number from server

    };

    this.print = function () {
      boarding.state = 'PRINT';
      // timeout
      $timeout(boarding.reset, 3000);
    };

    this.reset = function () {
      boarding.player = '';
      boarding.state = 'INIT';
    };
  });
