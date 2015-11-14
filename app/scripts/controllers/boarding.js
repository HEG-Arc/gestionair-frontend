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
    //$0.contentDocument.getElementsByClassName('st11')[0].textContent=123
    this.board = function () {
      boarding.state = 'GUIDE1';
      //contact server
      //display info with number from server

    };

    var timer;
    this.print = function () {
      boarding.state = 'PRINT';
      // timeout
      //TODO config on server
      timer = $timeout(boarding.reset, 10000);
    };

    this.reset = function () {
      $timeout.cancel(timer);
      boarding.player = '';
      boarding.state = 'INIT';
    };
  });
