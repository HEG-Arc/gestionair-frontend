'use strict';

/**
 * @ngdoc function
 * @name gestionairFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gestionairFrontendApp
 */
angular.module('gestionairFrontendApp')
  .controller('MainCtrl', function ($mdSidenav, $cookies, $location, api) {

    var main = this;
    main.api = api;

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
      // ctrl + shift + x
      if( event.ctrlKey && event.shiftKey && event.keyCode === 24 ){
        main.logout();
      }
    };

    this.logout = function(){
      main.setMode('');
      //remove admin?
    };

    this.login = function (){
      console.log(main.user);
      //admin can access dashboard
      main.setMode('dashboard');
    };


  });
