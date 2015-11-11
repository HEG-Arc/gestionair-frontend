'use strict';

describe('Controller: ScoresCtrl', function () {

  // load the controller's module
  beforeEach(module('gestionairFrontendApp'));

  var ScoresCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScoresCtrl = $controller('ScoresCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ScoresCtrl.awesomeThings.length).toBe(3);
  });
});
