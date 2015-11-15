'use strict';

/**
 * @ngdoc function
 * @name gestionairFrontendApp.controller:OnboardingCtrl
 * @description
 * # OnboardingCtrl
 * Controller of the gestionairFrontendApp
 */
angular.module('gestionairFrontendApp')
  .controller('BoardingCtrl', function ($timeout, api) {
    var boarding = this;
    boarding.state = 'INIT';

    this.board = function () {
      boarding.state = 'GUIDE1';
      //contact server
      //display info with number from server
      boarding.player.id = Math.floor(Math.random() * 100) + 100;
    };

    var timer;
    this.print = function () {
      boarding.state = 'PRINT';
      timer = $timeout(boarding.reset, api.config.boarding_reset);
    };

    this.reset = function () {
      $timeout.cancel(timer);
      boarding.player = {};
      boarding.state = 'INIT';
    };
  });
