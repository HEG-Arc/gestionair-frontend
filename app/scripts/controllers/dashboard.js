'use strict';

/**
 * @ngdoc function
 * @name gestionairFrontendApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the gestionairFrontendApp
 */
angular.module('gestionairFrontendApp')
  .controller('DashboardCtrl', function ( $scope, api ) {
    // display states of player in progress
    // display summary stats
    var dashboard = this;
    dashboard.api = api;
    dashboard.stats = {};

    /*
    //other stats?
    - median time for steps
    - total time played,...
    - prizes?

    */

    dashboard.displayPlayers = function( state ){
      var players = [];
      Object.keys(api.players).forEach(function(key){
        if (state === api.players[key].state) {
          players.push(api.players[key]);
        }
      });
      return players;
    };

    $scope.api = api;

    $scope.$watch('api.players', function(){
      dashboard.stats = {
        CREATED: 0,
        PRINTED: 0,
        PLAYING: 0,
        LIMIT_REACHED: 0,
        WON: 0
      };
      Object.keys(api.players).forEach(function(key){
        dashboard.stats[api.players[key].state]++;
      });
    }, true);

  });
