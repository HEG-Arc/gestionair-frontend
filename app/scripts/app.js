'use strict';

/**
 * @ngdoc overview
 * @name gestionairFrontendApp
 * @description
 * # gestionairFrontendApp
 *
 * Main module of the application.
 */
angular
  .module('gestionairFrontendApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html'
      })
      .when('/boarding', {
        templateUrl: 'views/boarding.html',
        controller: 'BoardingCtrl',
        controllerAs: 'boarding'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard'
      })
      .when('/scores', {
        templateUrl: 'views/scores.html',
        controller: 'ScoresCtrl',
        controllerAs: 'scores'
      })
      .when('/wheel', {
        templateUrl: 'views/wheel.html',
        controller: 'WheelCtrl',
        controllerAs: 'wheel'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($mdThemingProvider) {
  $mdThemingProvider.definePalette('arc', {
      '50': '0098d8',
      '100': '0098d8',
      '200': '0098d8',
      '300': '0098d8',
      '400': '0098d8',
      '500': '0098d8',
      '600': '0098d8',
      '700': '0098d8',
      '800': '0098d8',
      '900': '0098d8',
      'A100': '0098d8',
      'A200': '0098d8',
      'A400': '0098d8',
      'A700': '0098d8',
      'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                          // on this palette should be dark or light
      'contrastDarkColors': undefined,
      'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.theme('default')
      .primaryPalette('arc')
      // If you specify less than all of the keys, it will inherit from the
      // default shades
      .accentPalette('green', {
        'default': '600' // use shade 200 for default, and keep all other shades the same
      });
  })
  .run(function(api){
    //api.startSim();
  });
