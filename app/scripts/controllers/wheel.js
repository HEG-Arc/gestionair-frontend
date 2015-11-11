'use strict';

/**
 * @ngdoc function
 * @name gestionairFrontendApp.controller:WheelCtrl
 * @description
 * # WheelCtrl
 * Controller of the gestionairFrontendApp
 */
angular.module('gestionairFrontendApp')
  .controller('WheelCtrl', function ($scope) {
    $scope.win = 1;
    this.wheel = {
      // Note how prize end angle is 1 less than start angle of next prize so no overlap.
      image: 'images/prizewheel.png',
      prizes: [
        {'name' : 'un bloc-note', 'startAngle' : 0,   'endAngle' : 44},
        {'name' : 'un porte-clefs', 'startAngle' : 45,  'endAngle' : 89},
        {'name' : 'une sacoche', 'startAngle' : 90,  'endAngle' : 134},
        {'name' : 'un linge de bain', 'startAngle' : 135, 'endAngle' : 179},
        {'name' : 'un parapluie', 'startAngle' : 180, 'endAngle' : 224},
        {'name' : 'un jeux de cartes', 'startAngle' : 225, 'endAngle' : 269},
        {'name' : 'des bonbons', 'startAngle' : 270, 'endAngle' : 314},
        {'name' : 'un stylo', 'startAngle' : 315, 'endAngle' : 360}
      ]
    };
  });
