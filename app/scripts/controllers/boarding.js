'use strict';

/**
 * @ngdoc function
 * @name gestionairFrontendApp.controller:OnboardingCtrl
 * @description
 * # OnboardingCtrl
 * Controller of the gestionairFrontendApp
 */
angular.module('gestionairFrontendApp')
  .controller('BoardingCtrl', function ($timeout, api, $location) {
    var boarding = this;
    boarding.state = 'INIT';

    this.board = function () {
      if($location.search().test){
        boarding.state = 'GUIDE1';
        boarding.player.id = 345;
        boarding.player.code = '345';
        return;
      }
      api.createPlayer(boarding.player).then(function( result ) {
        boarding.state = 'GUIDE1';
        boarding.player.id = result.id;
        boarding.player.code = result.code;
      }, function(){
        boarding.state = 'FORM';
        //TODO: display error;
      });
    };

    var timer;
    this.print = function () {
      boarding.state = 'PRINT';
      api.printPlayerId(boarding.player.id);
      //TODO add configurable ding?
      timer = $timeout(boarding.reset, api.config.boarding_reset);
    };

    this.reset = function () {
      $timeout.cancel(timer);
      boarding.player = {};
      boarding.state = 'INIT';
    };
  });
