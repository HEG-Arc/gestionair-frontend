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
    $scope.win = {
      prize: 1
    };
    $timeout(function(){
    wheel.wheel.prizes = [
        {id: 1, src: '', 'name' : 'un bloc-note', 'startAngle' : 0,   'endAngle' : 44},
        {id: 2, src: '', 'name' : 'un porte-clefs', 'startAngle' : 45,  'endAngle' : 89},
        {id: 3, src: '', 'name' : 'une sacoche', 'startAngle' : 90,  'endAngle' : 134},
        {id: 4, src: '', 'name' : 'un linge de bain', 'startAngle' : 135, 'endAngle' : 179},
        {id: 5, src: '', 'name' : 'un parapluie', 'startAngle' : 180, 'endAngle' : 224},
        {id: 6, src: '', 'name' : 'un jeux de cartes', 'startAngle' : 225, 'endAngle' : 269},
        {id: 7, src: '', 'name' : 'des bonbons', 'startAngle' : 270, 'endAngle' : 360},
        {id: 8, src: '', 'name' : 'un stylo', 'startAngle' : 315, 'endAngle' : 360}];
    });

    wheel.wheel.player = {
      name: 'Julien',
      score: 123,
      state: 'SCANNED_WHEEL', //WON, PLAYING, SCANNED_PEN, SCANNED_WHEEL
      prize: {
        name: 'un stylo',
        src: 'images/prizes/stylo.png'
      }
    };


  });
