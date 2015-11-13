'use strict';

/**
 * @ngdoc service
 * @name gestionairFrontendApp.api
 * @description
 * # api
 * Service in the gestionairFrontendApp.
 */
angular.module('gestionairFrontendApp')
  .service('api', function () {

    //states
    this.players = {}; //id : { name:, state:, score}
    this.phones = {}; //number : {state: 'offline'}

    this.handleEvent = function ( msg ) {
      switch (msg.type) {
        case 'PLAYER_CREATED':
          //nom, id, npa, timestamp
          break;
        case 'PLAYER_PRINTED':
          //id, timestamp
          break;
        case 'PLAYER_ANSWERING':
         /*
         timestamp
          playerId: __player.id__,
                        number: __phone.number__,
                        flag: 'gb' //de, fr, ...
          */
          break;
        case 'PLAYER_ANSWERED':
          /*
          timestamp
          playerId: __player.id__,
                            number: __phone.number__,
                            correct: 1 //0
                            */
          break;
        case 'PLAYER_LIMIT_REACHED':
          //id, timestamp
          break;
        case 'PLAYER_SCANNED':
          //error done, pen, wheel or play more (option to get pen?)
          //score
          //timestamp
          break;
        case 'WHEEL_START': //== 'PLAYER_WON'
          //price to win
          //timestamp
          break;
        case 'PHONE_RINGING':
          //msg.number
          break;
        case 'PHONE_STOPRINGING':
          //msg.number
          break;
        case 'PHONE_OFFLINE':
          //msg.number
          break;
        case 'PHONE_ONLINE':
          //msg.number
          break;
      }
    };
  });
