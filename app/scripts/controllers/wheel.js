'use strict';

/**
 * @ngdoc function
 * @name gestionairFrontendApp.controller:WheelCtrl
 * @description
 * # WheelCtrl
 * Controller of the gestionairFrontendApp
 */
angular.module('gestionairFrontendApp')
  .controller('WheelCtrl', function ($scope, $timeout, $location, api) {
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
    }, true);

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
        {id: 1, src: '/media/stylo_wdDndJL.png', 'name' : 'un bloc-note', 'startAngle' : 0,   'endAngle' : 44},
        {id: 2, src: '/media/lampe.png', 'name' : 'un porte-clefs', 'startAngle' : 45,  'endAngle' : 89},
        {id: 3, src: '/media/stylo_wdDndJL.png', 'name' : 'une sacoche', 'startAngle' : 90,  'endAngle' : 134},
        {id: 4, src: '/media/stylo_wdDndJL.png', 'name' : 'un linge de bain', 'startAngle' : 135, 'endAngle' : 179},
        {id: 5, src: '/media/stylo_wdDndJL.png', 'name' : 'un parapluie', 'startAngle' : 180, 'endAngle' : 224},
        {id: 6, src: '/media/stylo_wdDndJL.png', 'name' : 'un jeux de cartes', 'startAngle' : 225, 'endAngle' : 269},
        {id: 7, src: '/media/stylo_wdDndJL.png', 'name' : 'des bonbons', 'startAngle' : 270, 'endAngle' : 314},
        {id: 8, src: '/media/stylo_wdDndJL.png', 'name' : 'un stylo', 'startAngle' : 315, 'endAngle' : 360}];
      if($location.search().test){
        wheel.debug = true;
        wheel.wheel.player = {
          name: 'Julien',
          score: 123,
          state: 'SCANNED_WHEEL', //WON, PLAYING, SCANNED_PEN, SCANNED_WHEEL
          prize: {
            name: 'un stylo',
            src: 'images/prizes/stylo.png'
          }
        };
      }
    });


  });
