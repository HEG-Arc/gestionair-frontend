'use strict';

/**
 * @ngdoc function
 * @name gestionairFrontendApp.controller:WheelCtrl
 * @description
 * # WheelCtrl
 * Controller of the gestionairFrontendApp
 */
angular.module('gestionairFrontendApp')
  .controller('WheelCtrl', function ($scope, $timeout, api) {
    var wheel = this;
    $scope.win = 1;

    //TODO states
    //local sounds

    this.wheel = api.wheel;
    api.isSlideshowVisible = true;

    $scope.$watch('wheel.wheel.player', function(){
      if( wheel.wheel.player ) {
        api.isSlideshowVisible = false;

      } else {
        api.isSlideshowVisible = true;
      }
    });

    this.testWheelItemChange = function (){
      wheel.wheel.prizes.push({'name' : 'un stylo', 'startAngle' : 315, 'endAngle' : 360});
      wheel.wheel.prizes[6].endAngle = 314;
      wheel.wheel.prizes[3].src = 'images/prizewheel.png';
    };

    $timeout(function(){
      api.registerWheel(wheel.wheel);
    }, 1);

    $scope.$on('$destroy', function() {
      api.unregisterWheel(wheel.wheel);
      api.isSlideshowVisible = false;
    });

    /* test */
    /*
    wheel.wheel.player = {
      name: 'Julien',
      score: 123,
      state: 'SCANNED_WHEEL', //WON, PLAYING, SCANNED_PEN, SCANNED_WHEEL
      prize: {
        name: 'un stylo',
        src: 'images/prizes/stylo.png'
      }
    };
    */

  });
