'use strict';

describe('Service: sim', function () {

  // load the service's module
  beforeEach(module('gestionairFrontendApp'));

  // instantiate service
  var sim;
  beforeEach(inject(function (_sim_) {
    sim = _sim_;
  }));

  it('should do something', function () {
    expect(!!sim).toBe(true);
  });

});
