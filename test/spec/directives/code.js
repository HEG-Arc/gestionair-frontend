'use strict';

describe('Directive: code', function () {

  // load the directive's module
  beforeEach(module('gestionairFrontendApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<code></code>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the code directive');
  }));
});
