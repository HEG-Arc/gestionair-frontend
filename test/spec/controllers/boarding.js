'use strict';

describe('Controller: OnboardingCtrl', function () {

  // load the controller's module
  beforeEach(module('gestionairFrontendApp'));

  var BoardingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BoardingCtrl = $controller('BoardingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BoardingCtrl.awesomeThings.length).toBe(3);
  });
});
