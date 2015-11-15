'use strict';

/**
 * @ngdoc directive
 * @name gestionairFrontendApp.directive:code
 * @description
 * # code
 */
angular.module('gestionairFrontendApp')
  .directive('code', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.$watch(attrs.code, function(newVal, oldVal) {
          if(newVal!==oldVal) {
            element[0].contentDocument.getElementById('code').textContent = newVal;
          }
        });
      }
    };
  });
