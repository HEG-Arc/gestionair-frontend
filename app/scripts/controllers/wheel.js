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

    this.wheel = {
      // Note how prize end angle is 1 less than start angle of next prize so no overlap.
      prizes: [
        {'name' : 'un bloc-note', 'startAngle' : 0,   'endAngle' : 44},
        {'name' : 'un porte-clefs', 'startAngle' : 45,  'endAngle' : 89},
        {'name' : 'une sacoche', 'startAngle' : 90,  'endAngle' : 134},
        {'name' : 'un linge de bain', 'startAngle' : 135, 'endAngle' : 179},
        {'name' : 'un parapluie', 'startAngle' : 180, 'endAngle' : 224},
        {'name' : 'un jeux de cartes', 'startAngle' : 225, 'endAngle' : 269},
        {'name' : 'des bonbons', 'startAngle' : 270, 'endAngle' : 360},
        //{'name' : 'un stylo', 'startAngle' : 315, 'endAngle' : 360}
      ]
    };

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
