'use strict';

/**
 * @ngdoc service
 * @name gestionairFrontendApp.api
 * @description
 * # api
 * Service in the gestionairFrontendApp.
 */
angular.module('gestionairFrontendApp')
  .service('api', function ( $rootScope, $http, $timeout, $window, sim ) {

    var api = this;
    var URL = 'http://157.26.91.80';

    api.isConnected = false;
    api.debug = false;

    var serverConnection = function () {
        var client;

        var onConnect =  function () {
            api.isConnected = true;
            client.subscribe('/exchange/gestionair/simulation', function ( message ) {
                $rootScope.$apply(function(){
                  try {
                      api.handleEvent(JSON.parse(message.body));
                  } catch (e) {
                      console.log('error', e);
                      console.log(message.body);
                  }
                });
            });
        };

        api.eventLogs = [];

        var stompConnect = function () {
            var ws = new SockJS(URL + ':15674/stomp');
            client = Stomp.over(ws);

            //disable unsupported heart-beat
            client.heartbeat.outgoing = 0;
            client.heartbeat.incoming = 0;
            client.debug = function ( m ) {
              if (api.debug) {
                api.eventLogs.unshift(m);
              }
            };
            client.connect('guest', 'guest', onConnect, failureConnect, '/');
        };

        var failureConnect = function () {
            api.isConnected = false;
            $timeout(stompConnect, 10000);
        };

        stompConnect();
        return client;
    };

    //connect to server
    var server = serverConnection();
    api.config = {
      boarding_reset: 240000,
      slideshow_timer: 3000,
      timeout_wheel: 60000,
      slideshow: [
        'images/slideshow/ARC1.jpg',
        'images/slideshow/ARC2.jpg',
        'images/slideshow/ARC3.jpg'
      ],
      menu: 'Menu',
      boarding: 'Boarding',
      wheel: 'Wheel',
      scores: 'Scores',
      dashboard: 'Dashboard',
      mode: 'Mode',
      logout: 'Logout',
      login: 'Connexion',
      username: "Nom d'utilistateur",
      password: 'Mot de passe',
      connection_error: 'connection error, retrying...',
      signup: 'Inscription',
      languages: 'Langues',
      name: 'Nom',
      name_required: 'Ce champ est requis!',
      email: 'Email',
      showZipCode: 'false',
      zip_code: 'Npa',
      play: 'Jouer',
      ready_to_start: 'Prêt(e) à participer ?',
      how_to: 'Voici comment faire...',
      signup_take_ticket: 'Inscrivez-vous et prenez votre ticket',
      take_phone: 'Lorsqu’un téléphone sonne, décrochez-le',
      input_code: 'Saisissez sur le téléphone le numéro indiqué sur votre ticket pour vous identifier',
      listen: 'Écoutez la demande et cherchez la bonne solution !',
      answer: 'Déviez l’appel vers le bon département',
      repeat: 'Raccrochez le téléphone et attendez qu’un téléphone sonne à nouveau pour répondre à la prochaine question',
      goto_wheel: 'Une fois votre mission accomplie, venez jouer à la roue de la fortune et remportez de nombreux prix !',
      warn_ticket: "N'oubliez pas votre ticket!",
      new_player: 'Nouveau joueur',
      msg_playing: /* Name */  "vous n'avez pas encore répondu à suffisament d'appels!",
      msg_already_won: /* Name */ 'vous avez déjà joué!',
      msg_won_pen: 'Vous avez gagné', /* price name */
      msg_won_wheel: 'Bravo vous avez gagné', /* price name */
      msg_with_your: /* Name */ 'avec vos', /* score */
      msg_points: 'points',
      msg_turn_wheel: 'Vous pouvez tourner la roue:',
      players: 'Joueurs',
      details: 'Détails',
      phones: 'Phones',
      debug: 'Debug',
      control: 'Control',
      bumper: 'Bouton',
      scan: 'Scan',
      created: 'CREATED',
      printed: 'PRINTED',
      playing: 'PLAYING',
      limit_reached: 'LIMIT_REACHED',
      won: 'WON'
    };

    // Get config from server and replace local config
    $http.get(URL + '/game/api/load-config')
    .then(function( result ){
           angular.extend(api.config, result.data);
    });

    api.isSlideshowVisible = false;

    //states
    api.players = {}; //id : { name:, state:, score}
    api.scores = [];

    //get scores from server
     $http.get(URL + '/game/api/players-list')
    .then(function( result ){
         api.players = result.data;
         Object.keys(api.players).forEach(function(key){
           var player = api.players[key];
            if( player.state === 'LIMIT_REACHED'|| player.state === 'SCANNED' || player.state === 'WON') {
              api.scores.push(player);
            }
         });
    });

    api.phones = {}; //number : {state: 'offline', player, flag}
    api.wheel = {
      player: undefined,
      prizes: [],
      URL: URL
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

    api.getPlayer = function ( id ) {
      var player = api.players[id];
      if (!player) {
        player = {
          id: id,
          name: '?'
        };
        if ( id > -1 ) {
          api.players[id] = player;
        }
      }
      return player;
    };

    api.createPlayer = function (player) {
      return $http.post(URL + '/game/api/register-player', player);
    };

    api.printPlayerId = function (id) {
      return $http.get(URL + '/game/api/print-player/' + id);
    };

    api.sendScan = function (code) {
      return $http.get(URL + '/game/api/scan-code/' + code);
    };

    api.sendBumper = function () {
      return $http.get(URL + '/game/api/bumper');
    };

    api.startGame = function () {
      return $http.get(URL + '/game/start');
    };

    api.stopGame = function () {
      return $http.get(URL + '/game/stop');
    };

    api.call = function ( number ) {
      return $http.get(URL + '/game/api/call/' + number);
    };

    api.sendRefresh = function () {
       server.send('/exchange/gestionair/simulation', {}, angular.toJson({
         type: 'FRONTEND_REFRESH'
       }));
    };

    var wheel_timeout_timer;

    api.handleEvent = function ( msg ) {
      var player, phone;
      switch (msg.type) {
        case 's':
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
          player = api.getPlayer(msg.playerId);
          player.print_time = msg.timestamp;
          player.state = 'PRINTED';
          break;

        case 'PLAYER_ANSWERING':
          player = api.getPlayer(msg.playerId);
          player.state = 'PLAYING';
          player.lastplay_time = msg.timestamp;
          player.attempts++;

          phone = api.getPhone(msg.number);
          phone.flag = msg.flag;
          phone.player = player;
          break;

        case 'PLAYER_ANSWERED':
          player = api.getPlayer(msg.playerId);
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
          player = api.getPlayer(msg.playerId);
          player.limit_time = msg.timestamp;
          player.score = msg.score;
          player.state = 'LIMIT_REACHED';
          player.languages = msg.languages;
          api.scores.push(player);
          break;

        case 'PLAYER_SCANNED':
          //error done, pen, wheel or play more (option to get pen?)
          //TODO maybe queue system?
          player = api.getPlayer(msg.playerId);
          player.state = msg.state;
          if ( wheel_timeout_timer ) {
                  $timeout.cancel(wheel_timeout_timer);
          };
          if (player.state === 'SCANNED_WHEEL' || player.state === 'SCANNED_PEN') {
            player.scan_time = msg.timestamp;
            api.wheel.won = undefined;
            player.score = msg.score;
            if (player.state === 'SCANNED_WHEEL'){
              //show wheel msg.prizes
              api.wheel.prizes = msg.prizes;
            } else if (player.state === 'SCANNED_PEN') {
              player.prize = msg.prize;

               wheel_timeout_timer = $timeout(function(){
                player.state = 'WON';
                api.wheel.player = undefined;
              }, api.config.timeout_wheel);
            }
          } else {
             wheel_timeout_timer = $timeout(function(){
                api.wheel.player = undefined;
              }, api.config.timeout_wheel);
          }
          api.wheel.player = player;
          break;

        case 'WHEEL_START': //== 'PLAYER_WON'
          player = api.getPlayer(msg.playerId);
          player.wheel_time = msg.timestamp;
          player.prize = msg.prize;
           if ( wheel_timeout_timer ) {
                  $timeout.cancel(wheel_timeout_timer);
               };

          api.startWheels({duration: msg.wheel_duration, prize: player.prize});

          $timeout(function(){
               wheel_timeout_timer = $timeout(function(){
                player.state = 'WON';
                api.wheel.player = undefined;
              }, api.config.timeout_wheel);
          }, msg.wheel_duration + 1000 + api.config.timeout_wheel);

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

        case 'FRONTEND_REFRESH':
          $window.location.reload(true);
          break;
      }

    };
  });
