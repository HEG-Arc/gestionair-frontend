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
      template: '<canvas></canvas>',
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
        var s = new Snap(800, 800);
        s.circle(400, 400, r).attr({
          fill: '#fff',
          stroke: 'black',
          'stroke-width': '5px'
        });
        var gWheel = s.g();

        var drawPrizes = function () {
          gWheel.clear();
          scope.internalControl.prizes.forEach(function ( item ) {
            gWheel.line(400, 400,
              400 + Math.sin(Snap.rad(item.startAngle)) * r, 400 + Math.cos(Snap.rad(item.startAngle)) * r)
              .attr({
                stroke: 'black',
                'stroke-width': '5px'
              });
              var gi = gWheel.g();
              var middleAngle = item.startAngle + (( item.endAngle - item.startAngle ) / 2);
              console.log(middleAngle);
              gi.image(item.src, 0, 0, 50, 50).transform('T-25,-25R' + (180 - middleAngle) + ', 0, 0');
              gi.transform('t' + (400 + Math.sin(Snap.rad(middleAngle)) * r*0.7) + ',' + (400 + Math.cos(Snap.rad(middleAngle)) * r * 0.7));

          });
          var centerC = gWheel.circle(400, 400, 50);
          centerC.attr({
              fill: '#bada55',
              stroke: '#000',
              strokeWidth: 5
          });
          gWheel.text(400, 420, 'W').attr({
            'text-anchor': 'middle',
            'font-size': '3em',
            'font-weight': 'bold',
            fill: '#fff'
          });
        };

        scope.$watch('internalControl.prizes', drawPrizes, true);

        //anchor
        s.polyline(360, 0,  440, 0, 400, 50);

        // old wheel

        var surfaceContext = element[0].getContext('2d');
        var wheel = new Image();
        wheel.onload = function () {
          element[0].width = wheel.width;
          element[0].height = wheel.height;
          surfaceContext.drawImage(wheel, 0, 0);
        };
        wheel.src = 'images/prizewheel.png';

        scope.internalControl.spin = function (targetIndex) {
          if(!spinning){
            scope.internalControl.won = undefined;
            spinning = true;
            var stopAngle = Math.floor(scope.internalControl.prizes[targetIndex].startAngle + (Math.random() * (scope.internalControl.prizes[targetIndex].endAngle - scope.internalControl.prizes[targetIndex].startAngle)));
            stopAngle = (360 + scope.internalControl.pointerAngle) - stopAngle;
            var power = 0.8;
            var targetAngle = (360 * (power * 6) + stopAngle);
            var randomLastThreshold = Math.floor(90 + (Math.random() * 90));

            var angle = 0;
            var currentAngle = 0;
            var spinTimer;
            console.log(targetAngle);
            gWheel.transform('r0, 400, 400');
            gWheel.animate({ transform: 'r' + targetAngle + ', 400, 400' }, 6000, mina.easein);

            var doSpin = function doSpin() {
	             // Save the current context - we need this so we can restore it later.
	             surfaceContext.save();
	             // Translate to the center point of our image.
	             surfaceContext.translate(wheel.width * 0.5, wheel.height * 0.5);
               // Perform the rotation by the angle specified in the global variable (will be 0 the first time).
	             surfaceContext.rotate(currentAngle * Math.PI / 180);
               // Translate back to the top left of our image.
               surfaceContext.translate(-wheel.width * 0.5, -wheel.height * 0.5);
               // Finally we draw the rotated image on the canvas.
               surfaceContext.drawImage(wheel, 0, 0);
               // And restore the context ready for the next loop.
               surfaceContext.restore();

              // ------------------------------------------
              // Add angle worked out below by thresholds to the current angle as we increment the currentAngle up until the targetAngle is met.
              currentAngle += angle;
              console.log(currentAngle);

              // ------------------------------------------
              // If the currentAngle is less than targetAngle then we need to rotate some more, so figure out what the angle the wheel is to be rotated
              // by next time this function is called, then set timer to call this function again in a few milliseconds.
              if (currentAngle < targetAngle) {
                // We can control how fast the wheel spins by setting how much is it to be rotated by each time this function is called.
                // In order to do a slowdown effect, we start with a high value when the currentAngle is further away from the target
                // and as it is with certian thresholds / ranges of the targetAngle reduce the angle rotated by - hence the slowdown effect.

                // The 360 * (power * 6) in the startSpin function will give the following...
                // HIGH power = 360 * (3 * 6) which is 6480
                // MED power = 360 * (2 * 6) which equals 4320
                // LOW power = 360 * (1 * 6) equals 2160.

                // Work out how much is remaining between the current angle and the target angle.
                var angleRemaining = (targetAngle - currentAngle);

                /********************
                *
                * THIS SHOULD BE REPLACED BY A EASING FUNCTION!!!
                *
                ***********************/



                // Now use the angle remaining to set the angle rotated by each loop, reducing the amount of angle rotated by as
                // as the currentAngle gets closer to the targetangle.
                if (angleRemaining > 6480) {
                  angle = 55;
                } else if (angleRemaining > 5000) {		// NOTE: you can adjust as desired to alter the slowdown, making the stopping more gradual or more sudden.
                  angle = 45;						// If you alter the forumla used to work out the targetAngle you may need to alter these.
                } else if (angleRemaining > 4000) {
                  angle = 30;
                } else if (angleRemaining > 2500) {
                  angle = 25;
                } else if (angleRemaining > 1800) {
                  angle = 15;
                } else if (angleRemaining > 900) {
                  angle = 11.25;
                } else if (angleRemaining > 400) {
                  angle = 7.5;
                } else if (angleRemaining > 220) {					// You might want to randomize the lower threhold numbers here to be between a range
                  angle = 3.80;								// otherwise if always within last 150 when the speed is set to 1 degree the user can
                } else if (angleRemaining > randomLastThreshold) {	// tell what prize they will win before the wheel stops after playing the wheel a few times.
                  angle = 1.90;								// This variable is set in the startSpin function. Up to you if you want to randomise the others.
                } else {
                  angle = 1;		// Last angle should be 1 so no risk of the wheel overshooting target if using preDetermined spin mode
                          // (only a problem if pre-Determined location is near edge of a segment).
                }

                var t = 1 - (angleRemaining / targetAngle);

                angle =  55 * (--t)*t+1;

                // Set timer to call this function again using the miliseconds defined in the speed global variable.
                // This effectivley gets creates the animation / game loop.

                // IMPORTANT NOTE:
                // Since creating this wheel some time ago I have learned than in order to do javascript animation which is not affected by the speed at which
                // a device can exectute javascript, a "frames per second" approach with the javscript function requestAnimationFrame() should be used.
                // I have not had time to learn about and impliment it here, so you might want to look in to it if this method of animation is not
                // smooth enough for you.
                spinTimer = requestAnimationFrame(doSpin);
              } else {
                // currentAngle must be the same as the targetAngle so we have reached the end of the spinning.
                cancelAnimationFrame(spinTimer);
                scope.$apply(function(){
                  spinning = false;
                  scope.internalControl.won = scope.internalControl.prizes[targetIndex];
                });
              }
            };

            doSpin();

          }
        };
      }
    };
  });
