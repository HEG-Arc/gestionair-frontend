'use strict';

/**
 * @ngdoc directive
 * @name gestionairFrontendApp.directive:slideshow
 * @description
 * # slideshow
 */
angular.module('gestionairFrontendApp')
  .directive('flag', function ($timeout) {
    return {
      templateUrl: 'views/flag.html',
      replace: true,
      restrict: 'E',
      scope: {
        answer: '='
      },
      link: function postLink(scope) {
          scope.getLang = function () {
              return scope.answer && scope.answer.lang || scope.answer.flag;
          }
      }
    };
  });
