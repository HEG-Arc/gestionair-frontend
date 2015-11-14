'use strict';

/**
 * @ngdoc function
 * @name gestionairFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gestionairFrontendApp
 */
angular.module('gestionairFrontendApp')
  .controller('MainCtrl', function ($mdSidenav, $cookies, $location) {

    var main = this;

    this.setMode = function (mode) {
      $cookies.put('mode', mode);
      this.mode = mode;
      $location.path('/' + mode);
    };

    this.setMode( $cookies.get('mode') );

    this.toggleLeftMenu = function() {
      $mdSidenav('left').toggle();
    };

    this.handleKeyPress = function ( event ){
      if( event.ctrlKey && event.shiftKey && event.keyCode === 24 ){
        main.setMode('');
      }
    };

    this.login = function (){
      console.log(main.user);
      //admin can access dashboard
      main.setMode('dashboard');
    };


  });
