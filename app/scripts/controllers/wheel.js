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

    $timeout(function(){
      api.registerWheel(wheel.wheel);
    }, 1);

    $scope.$on('$destroy', function() {
      api.unregisterWheel(wheel.wheel);
      api.isSlideshowVisible = false;
    });

    /* test */
    $scope.win = {
      prize: 1,
      duration: 1000,
      prizeCountTest: 8
    };

    var testPrizes = [
        {id: 1, src: '/media/penbook.png', 'name' : 'un bloc-note'},
        {id: 2, src: '/media/keycgain.png', 'name' : 'un porte-clefs'},
        {id: 3, src: '/media/bag.png', 'name' : 'une sacoche'},
        {id: 4, src: '/media/linge.png', 'name' : 'un linge de bain'},
        {id: 5, src: '/media/umbrella.png', 'name' : 'un parapluie'},
        {id: 6, src: '/media/sunglasses.png', 'name' : 'des lunettes'},
        {id: 7, src: '/media/mug.png', 'name' : 'une tasse'},
        {id: 8, src: '/media/torch.png', 'name' : 'une lampe'}];

    function generatePrizesList( n ){
        var prizes = [];
        var angle = Math.floor(360 / n);
        for(var i = 0; i < n; i++){
          testPrizes[i].startAngle = i * angle;
          testPrizes[i].endAngle = Math.min( i * angle + angle -1, 359);
          if ( i + 1 === n) {
            testPrizes[i].endAngle = 359;
          }
          prizes.push(testPrizes[i]);
        }
        return prizes;
    }


    $timeout(function(){
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
        $scope.$watch('win.prizeCountTest', function() {
           wheel.wheel.prizes = generatePrizesList( $scope.win.prizeCountTest );
        });
      }
    });


  });
