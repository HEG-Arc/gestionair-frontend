'use strict';

describe('Controller: OnboardingCtrl', function () {

  // load the controller's module
  beforeEach(module('gestionairFrontendApp'));

  var OnboardingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OnboardingCtrl = $controller('BoardingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BoardingCtrl.awesomeThings.length).toBe(3);
  });
});
