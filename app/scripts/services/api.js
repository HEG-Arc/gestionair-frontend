'use strict';

/**
 * @ngdoc service
 * @name gestionairFrontendApp.api
 * @description
 * # api
 * Service in the gestionairFrontendApp.
 */
angular.module('gestionairFrontendApp')
  .service('api', function ( $timeout, sim ) {

    var api = this;

    //inital dashboard data inital scores
    //post register, print, scan, bumper
    //post agi simulate phones

    //get from server
    api.config = {
      boarding_reset: 10000,
      slideshow_timer: 3000,
      slideshow: [
        'images/slideshow/ARC1.jpg',
        'images/slideshow/ARC2.jpg',
        'images/slideshow/ARC3.jpg'
      ]
    };

    api.isSlideshowVisible = false;

    //states
    api.players = {}; //id : { name:, state:, score}
    api.scores = [];
    api.phones = {}; //number : {state: 'offline', player, flag}
    api.wheel = {
      player: undefined,
      prizes: [
        {'name' : 'un bloc-note', 'startAngle' : 0,   'endAngle' : 44},
        {'name' : 'un porte-clefs', 'startAngle' : 45,  'endAngle' : 89},
        {'name' : 'une sacoche', 'startAngle' : 90,  'endAngle' : 134},
        {'name' : 'un linge de bain', 'startAngle' : 135, 'endAngle' : 179},
        {'name' : 'un parapluie', 'startAngle' : 180, 'endAngle' : 224},
        {'name' : 'un jeux de cartes', 'startAngle' : 225, 'endAngle' : 269},
        {'name' : 'des bonbons', 'startAngle' : 270, 'endAngle' : 360},
        //{'name' : 'un stylo', 'startAngle' : 315, 'endAngle' : 360}
      ]
    };
    var wheels = [];

    api.registerWheel = function (wheel) {
      wheels.push(wheel);
    };

    api.unregisterWheel = function (wheel) {
      wheels.splice(wheels.indexOf(wheel), 1);
    };

    api.startWheels = function (options){
      wheels.forEach(function(w){
        w.spin(options);
      });
    };

    api.sim = false;
    api.startSim = function(){
      if ( !api.sim ) {
        sim.run(api);
        api.sim = sim;
      }
    };

    api.getPhone = function ( number ) {
      var phone = api.phones[number];
      if(!phone){
        phone = {
          number: number
        };
        api.phones[number] = phone;
      }
      return phone;
    };

    api.handleEvent = function ( msg ) {
      var player, phone;
      switch (msg.type) {
        case 'PLAYER_CREATED':
          /*
          player = {
            id,
            name,
            npa,
            state,
            attempts,
            score,
            languages,
            start_time,
            print_time,
            lastplay_time,
            limit_time,
            scan_time,
            wheel_time
          }
          */
          api.players[msg.player.id] = msg.player;
          break;
        case 'PLAYER_PRINTED':
          player = api.players[msg.playerId];
          player.print_time = msg.timestamp;
          player.state = 'PRINTED';
          break;

        case 'PLAYER_ANSWERING':
          player = api.players[msg.playerId];
          player.state = 'PLAYING';
          player.lastplay_time = msg.timestamp;
          player.attempts++;

          phone = api.getPhone(msg.number);
          phone.flag = msg.flag;
          phone.player = player;
          break;

        case 'PLAYER_ANSWERED':
          player = api.players[msg.playerId];
          phone = api.getPhone(msg.number);
          phone.correct = msg.correct;
          $timeout(function(){
            phone.player = undefined;
            phone.state = 'ONLINE';
            phone.flag = '';
            phone.correct = '';
          }, 2000);
          break;

        case 'PLAYER_LIMIT_REACHED':
          player = api.players[msg.playerId];
          player.limit_time = msg.timestamp;
          player.state = 'LIMIT_REACHED';
          break;

        case 'PLAYER_SCANNED':
          //error done, pen, wheel or play more (option to get pen?)
          //TODO maybe queue system?
          player = api.players[msg.playerId];
          player.state = msg.state;
          if (player.state === 'SCANNED_WHEEL' || player.state === 'SCANNED_PEN') {
            player.scan_time = msg.timestamp;
            player.score = msg.score;
            player.languages = msg.languages;
            if (player.state === 'SCANNED_WHEEL'){
              //show wheel msg.prizes
            } else if (player.state === 'SCANNED_PEN') {
              player.prize = msg.prize;
              api.scores.push(player);
              //TODO: aftertimeout or interaction?
              //player.state = 'WON';
            }
          } else {
             //TODO:timeoutreset player
             //but cancel timer if new scan
          }
          api.wheel.player = player;
          break;

        case 'WHEEL_START': //== 'PLAYER_WON'
          player = api.players[msg.playerId];
          player.wheel_time = msg.timestamp;
          player.prize = msg.prize;

          //LOCAL event wheel start
          api.startWheels({duration: msg.wheel_duration, prize: player.prize});

          $timeout(function(){
              //TODO:aftertimeout or interaction?
              //player.state = 'WON';
            api.scores.push(player);
          }, msg.wheel_duration);

          break;

        case 'PHONE_RINGING':
          phone = api.getPhone(msg.number);
          phone.state = 'RINGING';
          break;

        case 'PHONE_STOPRINGING':
          phone = api.getPhone(msg.number);
          phone.state = 'ONLINE';
          break;

        case 'PHONE_OFFLINE':
          phone = api.getPhone(msg.number);
          phone.state = 'OFFLINE';
          break;

        case 'PHONE_ONLINE':
          phone = api.getPhone(msg.number);
          phone.state = 'ONLINE';
          break;
      }
    };
  });
