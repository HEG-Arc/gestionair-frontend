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
    // slideshow
    // wheel read to start
    // won prize
    //messages display
      // error already playes
      // ...
    //local sounds

    this.wheel = api.wheel;

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
    });

  });
