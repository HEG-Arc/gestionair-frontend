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


    //states
    api.players = {}; //id : { name:, state:, score}
    api.scores = [];
    api.phones = {}; //number : {state: 'offline', player, flag}
    api.wheel = {
      player: undefined,
      //prizes
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


          //THIS LOGIC ON SERVER
          if (msg.state === 'LIMIT_REACHED') {

          } else {
            //player.state == keep current_state
          }

          //local state for wheel

          //TODO maybe queue system?
          player = api.players[msg.playerId];
          player.state = msg.state;
          if (player.state === 'WON') {
            //already prize
          } else if (player.state === 'PLAYING') {
            //go play
          } else {
            player.scan_time = msg.timestamp;
            player.score = msg.score;
            player.languages = msg.languages;
            if (player.state === 'SCANNED_WHEEL'){
              //show wheel msg.prizes

            } else if (player.state === 'SCANNED_PEN') {
              //show pen
              api.scores.push(player);
            }
          }
          api.wheel.player = player;
          break;

        case 'WHEEL_START': //== 'PLAYER_WON'
          player = api.players[msg.playerId];
          player.wheel_time = msg.timestamp;
          player.prize = msg.prize;
          //LOCAL event wheel start
          api.scores.push(player);

          $timeout(function(){
            //api.scores.push(player);
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
