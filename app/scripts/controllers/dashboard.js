'use strict';

/**
 * @ngdoc function
 * @name gestionairFrontendApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the gestionairFrontendApp
 */
angular.module('gestionairFrontendApp')
  .controller('DashboardCtrl', function ( $scope, api, $timeout ) {
    // display states of player in progress
    // display summary stats
    var dashboard = this;
    dashboard.api = api;
    dashboard.stats = {};
    dashboard.sound = 'call';

    /*
    //other stats?
    - median time for steps
    - total time played,...
    - prizes?

    */

    dashboard.displayPlayers = function ( state ) {
      var players = [];
      Object.keys(api.players).forEach(function(key){
        if (state === api.players[key].state) {
          players.push(api.players[key]);
        }
      });
      return players;
    };

    dashboard.msgFilter = function ( msg ) {
      var filterEvent = function () {
        if ( dashboard.filterEvent ) {
          return dashboard.filterEvent === msg.type;
        }
        return true;
      };

      var filterPlayer = function () {
        if ( dashboard.filterPlayer ) {
          return Number(dashboard.filterPlayer) === msg.playerId || (msg.player && Number(dashboard.filterPlayer) === msg.player.id);
        }
        return true;
      };

      return filterEvent() && filterPlayer();
    };

    dashboard.sendScene = function () {
      var anim = [];
      var scene = [];
      $scope.dmx.values.split(',').forEach(function(v, index){
        scene.push([parseInt($scope.dmx.channel) + index, parseInt(v)]);
      });
      anim.push(scene);
      api.sendDMXAnim(anim);
    };

    dashboard.rainbow = function(len, steps, speed, center, width, phase){
      var anim = [];

      phase = phase || 0;
      center = center || 128;
      width = width || 127;
      var frequency = Math.PI*2/steps;
      for (var i = 0; i < len; ++i) {
        var red   = Math.round(Math.sin(frequency*i+2+phase) * width + center);
        var green = Math.round(Math.sin(frequency*i+0+phase) * width + center);
        var blue  = Math.round( Math.sin(frequency*i+4+phase) * width + center);
        anim.push([[300, green], [301, red], [302, blue]]);
        anim.push([[320, red], [321, green], [322, blue], [323, 255], [324, 0]]);
        anim.push(speed);
      }
      api.sendDMXAnim(anim);
    };
//r,g,b,255,0
//g,r,
    $scope.$watch('dmx.color', function(color){
      var matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
      var match = matchColors.exec(color);
      console.log(match);
      if (match !== null) {
        var red = parseInt(match[1]);
        var green = parseInt(match[2]);
        var blue = parseInt(match[3]);
        if ($scope.dmx.channel == '300') {
          api.sendDMXAnim([[[300, green], [301, red], [302, blue]]]);
        }
        if ($scope.dmx.channel === '320') {
          api.sendDMXAnim([[[320, red], [321, green], [322, blue], [323, 255], [324, 0]]]);
        }
      }
    });

    var debugTimeDuration = 5000;

    function debugPhoneDMX(number, startIn){
      var msg = {
        'number': number
      };
      // call phone to check lights
      $timeout(function() {
        msg.type = 'PHONE_RINGING';
        api.sendEvent(msg);
      }, startIn + debugTimeDuration);

      // simulate answering
      $timeout(function() {
        msg.type = 'PLAYER_ANSWERING';
        api.sendEvent(msg);
      }, startIn + debugTimeDuration * 2);
      // simulate wrong
      $timeout(function() {
      msg.type = 'PLAYER_ANSWERED';
      msg.correct = 0;
      api.sendEvent(msg);
      }, startIn + debugTimeDuration * 3);
      // simulate right
      $timeout(function() {
      msg.type = 'PLAYER_ANSWERED';
      msg.correct = 1;
      api.sendEvent(msg);
      }, startIn + debugTimeDuration * 4);
      // off
      $timeout(function() {
      msg.type = 'PHONE_STOPRINGING';
      api.sendEvent(msg);
      }, startIn + debugTimeDuration * 5);
    }

    dashboard.debugPhonesDMX = function() {
      if (dashboard.phoneNumber) {
        debugPhoneDMX(dashboard.phoneNumber, 0);
      } else {
        for (var i=0; i <10; i++) {
          debugPhoneDMX(1001 + i, i * debugTimeDuration);
        }
      }
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
