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
  });
