'use strict';

/**
 * @ngdoc directive
 * @name gestionairFrontendApp.directive:wheel
 * @description
 * # wheel adapted from This script contains the functions to load the winning wheel image and do the rotation of it.
	By Douglas McKechie @ www.dougtesting.net
 */
angular.module('gestionairFrontendApp')
  .directive('wheel', function ($timeout) {
    return {
      template: '<svg id="wheel"></svg>',
      restrict: 'E',
      replace: true,
      scope: {
        control: '='
      },
      link: function postLink(scope, element) {
        var spinning = false;

        scope.internalControl = scope.control || {};

        scope.internalControl.prizes = scope.internalControl.prizes || [];
        scope.internalControl.pointerAngle = scope.internalControl.pointerAngle || 0;

        scope.internalControl.isSpinning = function () {
          return spinning;
        };

        // svg wheel TEST
        var r = 380;
        var c = 400;

        element[0].setAttribute('width', c * 2);
        element[0].setAttribute('height', c * 2);
        var s = new Snap('#wheel');
        s.attr({viewBox: '0 0 ' + c * 2 + ' ' + c * 2});
        s.circle(c, c, r).attr({
          fill: '#fff',
          stroke: '#00405E',
          'stroke-width': '8px'
        });
        var gWheel = s.g();

        var colorArr = ['#FFF22D','#E49F30','#BBD147','#85C7DF','#15A8AB','#7C587E','#CA0088','#CC2229'];
        var drawPrizes = function () {
          var x1, y1, x2, y2;
          gWheel.clear();
          //draw Path
          scope.internalControl.prizes.forEach(function ( item, i ) {
              //substract 90 to start on top and not to the right
              x1 = Math.round( c + r * Math.cos(Snap.rad(item.startAngle-90)));
              y1 = Math.round( c + r * Math.sin(Snap.rad(item.startAngle-90)));

              x2 = Math.round( c + r * Math.cos(Snap.rad(item.endAngle-90)));
              y2 = Math.round( c + r * Math.sin(Snap.rad(item.endAngle-90)));

              var d = 'M' + c + ',' + c + ' L' + x1 + ',' + y1 + ' A' + r +',' + r + ' 0 0,1 ' + x2 + ',' + y2 + ' z'; //1 means clockwise
              gWheel.path(d)
              .attr({
                stroke: colorArr[i % 8],
                'stroke-width': '8px',
                fill: 'none'
              });
          });
          //drawpics
          scope.internalControl.prizes.forEach(function ( item, i ) {
              var gi = gWheel.g();
              var size = Math.round(Math.sin(Snap.rad(item.endAngle - item.startAngle)) * r / 2);
              var halfSize = Math.round(size/2);
              var middleAngle = item.startAngle + (( item.endAngle - item.startAngle ) / 2);
              gi.image(scope.internalControl.URL + item.src, 0, 0, size, size)
              .transform('T-' + halfSize + ',-' + halfSize + 'R' + (180 - middleAngle) + ', 0, 0');
              gi.transform('t' + (c + Math.cos(Snap.rad(middleAngle-90)) * r * 0.7) + ',' + (c + Math.sin(Snap.rad(middleAngle-90)) * r * 0.7));

          });
          var centerC = gWheel.circle(c, c, 50);
          centerC.attr({
              fill: '#0098D8',
              stroke: 'none',
              strokeWidth: 0
          });
          gWheel.image('images/arc.svg', 360, 380, 80, 40);
        };

        scope.$watch('internalControl.prizes', drawPrizes, true);

        //anchor
        var gAnchor = s.g();
        gAnchor.polygon(360, 5,  400, 5, 400, 70)
        .attr({
          fill: '#0090D4'
        });
        gAnchor.polygon(400, 5,  440, 5, 400, 70)
        .attr({

          fill: '#006FA2'
        });
        gAnchor.polygon(360, 5,  440, 5, 400, 70)
        .attr({
          fill: 'none',
          stroke: '#00405E',
          'stroke-width': '8px'
        });
        gAnchor.transform('r' + scope.internalControl.pointerAngle + ', ' + c + ', ' + c);


        scope.internalControl.getPrizeIndex = function (id) {
          for( var i=0; i < scope.internalControl.prizes.length; i++) {
            if (scope.internalControl.prizes[i].id === id) {
              return i;
            }
          }
        };

        var easeOutQuart  = function (n) {
          return -1 * ( Math.pow( n - 1, 4 ) - 1 );
        };



        scope.internalControl.spin = function (options) {
          var targetIndex = scope.internalControl.getPrizeIndex( options.prize );
          var prize = scope.internalControl.prizes[targetIndex];
          var duration = options.duration || 3000;
          if(!spinning && typeof  targetIndex !== 'undefined') { // TODO? what happens to event?
            scope.internalControl.won = undefined;
            spinning = true;
            var stopAngle = Math.floor(scope.internalControl.prizes[targetIndex].startAngle + (Math.random() * (scope.internalControl.prizes[targetIndex].endAngle - scope.internalControl.prizes[targetIndex].startAngle)));
            stopAngle =  360 - (stopAngle - scope.internalControl.pointerAngle);

            var nbTurns = Math.max(1, Math.floor(duration - 1000) / 500);
            stopAngle = stopAngle + nbTurns * 360;

            //reset wheel rotation
            gWheel.transform('r0, ' + c + ', ' + c);
            gWheel.animate({ transform: 'r' + stopAngle + ', 400, 400' }, duration, easeOutQuart, function(){
              scope.$apply(function(){
                spinning = false;
                $timeout(function(){
                    scope.internalControl.won = scope.internalControl.prizes[targetIndex];
                    scope.internalControl.player.prize = prize;
                }, 1000);
              });
            });
          }
        };
      }
    };
  });
