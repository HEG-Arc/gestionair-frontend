'use strict';

describe('Directive: wheel', function () {

  // load the directive's module
  beforeEach(module('gestionairFrontendApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<wheel></wheel>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the wheel directive');
  }));
});
