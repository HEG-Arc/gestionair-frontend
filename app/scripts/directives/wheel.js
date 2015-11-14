'use strict';

/**
 * @ngdoc directive
 * @name gestionairFrontendApp.directive:wheel
 * @description
 * # wheel adapted from This script contains the functions to load the winning wheel image and do the rotation of it.
	By Douglas McKechie @ www.dougtesting.net
 */
angular.module('gestionairFrontendApp')
  .directive('wheel', function () {
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
        s.circle(c, c, r).attr({
          fill: '#fff',
          stroke: 'black',
          'stroke-width': '5px'
        });
        var gWheel = s.g();

        var colorArr = ['#FFED00','#FFA000','#B3CE00','#009BA3','#00C7E2','#9A527C', '#FF007F'];
        var drawPrizes = function () {
          var x1, y1, x2, y2;
          gWheel.clear();
          scope.internalControl.prizes.forEach(function ( item, i ) {

              x1 = Math.round( c + r * Math.cos(Snap.rad(item.startAngle-90)));
              y1 = Math.round( c + r * Math.sin(Snap.rad(item.startAngle-90)));

              x2 = Math.round( c + r * Math.cos(Snap.rad(item.endAngle-90)));
              y2 = Math.round( c + r * Math.sin(Snap.rad(item.endAngle-90)));

              var d = 'M' + c + ',' + c + ' L' + x1 + ',' + y1 + ' A' + r +',' + r + ' 0 0,1 ' + x2 + ',' + y2 + ' z'; //1 means clockwise
              gWheel.path(d)
              .attr({
                stroke: colorArr[i % 7],
                'stroke-width': '8px',
                fill: 'none'
              });

              var gi = gWheel.g();
              var middleAngle = item.startAngle + (( item.endAngle - item.startAngle ) / 2);
              console.log(middleAngle);
              gi.image(item.src, 0, 0, 50, 50).transform('T-25,-25R' + (180 - middleAngle) + ', 0, 0');
              gi.transform('t' + (c + Math.sin(Snap.rad(middleAngle)) * r * 0.7) + ',' + (c + Math.cos(Snap.rad(middleAngle)) * r * 0.7));

          });
          var centerC = gWheel.circle(c, c, 50);
          centerC.attr({
              fill: '#0098D8',
              stroke: 'none',
              strokeWidth: 0
          });
          gWheel.text(c, 410, 'ARC').attr({
            'text-anchor': 'middle',
            'font-size': '2em',
            'font-weight': 'bold',
            fill: '#fff'
          });
        };

        scope.$watch('internalControl.prizes', drawPrizes, true);

        //anchor
        s.polyline(360, 0,  440, 0, 400, 50);


        scope.internalControl.spin = function (targetIndex) {
          if(!spinning){
            scope.internalControl.won = undefined;
            spinning = true;
            var stopAngle = Math.floor(scope.internalControl.prizes[targetIndex].startAngle + (Math.random() * (scope.internalControl.prizes[targetIndex].endAngle - scope.internalControl.prizes[targetIndex].startAngle)));
            stopAngle = 360 - stopAngle + scope.internalControl.pointerAngle;
            //TODO randInt should come from server as param to this function to be synched across screens
            var randInt = Math.floor( Math.random() * 3) + 1;
            stopAngle = stopAngle + randInt * 360;

            gWheel.transform('r0, 400, 400');
            gWheel.animate({ transform: 'r' + stopAngle + ', 400, 400' }, 1000 + randInt * 500, mina.easein, function(){
              scope.$apply(function(){
                spinning = false;
                scope.internalControl.won = scope.internalControl.prizes[targetIndex];
              });
            });
          }
        };
      }
    };
  });
