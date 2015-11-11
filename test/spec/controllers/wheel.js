'use strict';

describe('Controller: WheelCtrl', function () {

  // load the controller's module
  beforeEach(module('gestionairFrontendApp'));

  var WheelCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WheelCtrl = $controller('WheelCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(WheelCtrl.awesomeThings.length).toBe(3);
  });
});
