'use strict';

/**
 * @ngdoc service
 * @name gestionairFrontendApp.api
 * @description
 * # api
 * Service in the gestionairFrontendApp.
 */
angular.module('gestionairFrontendApp')
  .service('api', function ( $http, $timeout, sim ) {

    var api = this;
    var URL = 'http://server';

    //inital dashboard data inital scores
    //post register, print, scan, bumper
    //post agi simulate phones

    api.isConnected = false;

    var serverConnection = function () {
        var client;

        var onConnect =  function () {
            api.isConnected = true;
            client.subscribe('/exchange/gestionair/simulation', function ( message ) {
                try {
                    api.handleEvent(JSON.parse(message.body));
                } catch (e) {
                    console.log('error', e);
                    console.log(message.body);
                }
            });
        };

        var stompConnect = function () {
            var ws = new SockJS(URL + ':15674/stomp');
            client = Stomp.over(ws);

            //disable unsupported heart-beat
            client.heartbeat.outgoing = 0;
            client.heartbeat.incoming = 0;
            client.debug = function ( m ) {
              //console.log( m );
            };
            client.connect('guest', 'guest', onConnect, failureConnect, '/');
        }

        var failureConnect = function () {
            api.isConnected = false;
            $timeout(stompConnect, 10000);
        };

        stompConnect();
    };


    //TODO get from server
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
      prizes: []
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

    api.getStats = function () {
      $http.get(URL + '/???').then(function(result){
        //TODO api.players <- result.data
      });
    };

    api.createPlayer = function (player) {
      return $http.post(URL + '/???', player);
    };

    api.printPlayerId = function (id) {
      return $http.post(URL + '/???', {id: id});
    };

    api.sendScan = function ( code) {
      return $http.post(URL + '/???', {code: code});
    };

    api.sendBumper = function () {
      return $http.post(URL + '/???');
    };

    //TODO connect to events URL

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
          player.languages = msg.languages;
          api.scores.push(player);
          break;

        case 'PLAYER_SCANNED':
          //error done, pen, wheel or play more (option to get pen?)
          //TODO maybe queue system?
          player = api.players[msg.playerId];
          player.state = msg.state;
          if (player.state === 'SCANNED_WHEEL' || player.state === 'SCANNED_PEN') {
            player.scan_time = msg.timestamp;
            player.score = msg.score;
            if (player.state === 'SCANNED_WHEEL'){
              //show wheel msg.prizes
              api.wheel.prizes = msg.prizes;
            } else if (player.state === 'SCANNED_PEN') {
              player.prize = msg.prize;
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
