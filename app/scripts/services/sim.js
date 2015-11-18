'use strict';

/**
 * @ngdoc service
 * @name gestionairFrontendApp.sim
 * @description
 * # sim
 * Service in the gestionairFrontendApp.
 */
angular.module('gestionairFrontendApp')
  .service('sim', function ($timeout) {

    var sim = this;

    var Player = function Player( id ) {
      var p = this;

      this.id = id;
      this.name = sim.randomName();
      this.npa = sim.randomNpa();
      this.state = 'CREATED';
      this.attempts = 0;
      this.languages = [];
      this.score = 0;
      this.start_time = new Date();

      this.step = function ( api ) {
          if (p.state === 'CREATED') {
            api.handleEvent({
              type: 'PLAYER_PRINTED',
              playerId: p.id,
              timestamp: new Date()
            });
            p.state = 'PRINTED';
          } else if (p.state === 'PRINTED' || p.state === 'PLAYING') {
            if (p.attempts > 6) {
              api.handleEvent({
                type: 'PLAYER_LIMIT_REACHED',
                playerId: p.id,
                timestamp: new Date()
              });
              p.state = 'LIMIT_REACHED';
            } else {
              var number = Math.floor(Math.random() * 10 ) + 1000;
              var correct = Math.round(Math.random());
              var flag = ['fr', 'de', 'en', 'ru'][Math.floor(Math.random() * 4)];
              api.handleEvent({
                type: 'PLAYER_ANSWERING',
                playerId: p.id,
                number: number,
                timestamp: new Date(),
                flag: flag
              });
              //Timeout response < steptime
              $timeout(function(){
                p.score += correct;
                api.handleEvent({
                  type: 'PLAYER_ANSWERED',
                  playerId: p.id,
                  number: number,
                  correct: correct
                });
              }, 1000);
              p.attempts++;
              p.languages.push({code: flag, correct: correct});
              p.state = 'PLAYING';
            }

          } else if (p.state === 'LIMIT_REACHED') {
            if (Math.random() > 0.9) { //10% player too soon
              api.handleEvent({
                type: 'PLAYER_SCANNED',
                playerId: p.id,
                state: 'PLAYING',
                score: p.score,
                attempts: p.attempts, //?
                timestamp: new Date()
              });
            } else{
              if (p.score < 2) {
                // pen
                api.handleEvent({
                  type: 'PLAYER_SCANNED',
                  playerId: p.id,
                  state: 'SCANNED_PEN',
                  score: p.score,
                  prize: {
                    name: 'Stylo',
                    src: ''
                  },
                  languages: p.languages,
                  timestamp: new Date()
                });
                //save
                p.state = 'WON';
              } else {
                //show wheel
                api.handleEvent({
                  type: 'PLAYER_SCANNED',
                  playerId: p.id,
                  state: 'SCANNED_WHEEL',
                  score: p.score,
                  languages: p.languages,
                  prizes: [], //TODO
                  timestamp: new Date()
                });
                p.state = 'SCANNED_WHEEL';
              }
            }
          } else if (p.state === 'SCANNED_WHEEL') {
              api.handleEvent({
                type: 'WHEEL_START',
                playerId: p.id,
                prize: 1, //index of prize?
                wheel_duration: 2000,
                timestamp: new Date()
              });
              p.state = 'WON';
          } else if (p.state === 'WON') {
             if (Math.random() > 0.95) { //5% player already played
              api.handleEvent({
                type: 'PLAYER_SCANNED',
                playerId: p.id,
                state: 'WON',
                score: p.score,
                languages: p.languages,
                timestamp: new Date() //should be last scan/wheel time
              });
            }

          }
      }; // step
    };

    this.players = [];
    this.run = function ( api ) {
      var step = 0;
      var speed = 500;
      var loop = function(){
        sim.players.forEach(function(p){
          if( Math.random() > 0.5 ) {
            p.step(api);
          }
        });
        //create a player
        var player = new Player(1000 + step);
        api.handleEvent({
          type: 'PLAYER_CREATED',
          player: angular.copy(player)
        });
        step++;
        sim.players.push(player);
        if(step > 30) {
            speed = 10000;
        }
        $timeout(loop, speed);
      };
      loop();

    };

    this.randomName = function () {
      return sim.names[Math.floor(Math.random() * sim.names.length)];
    };

    this.randomNpa = function () {
      return Math.floor(Math.random() * 100) + 2000;
    };

    //from https://github.com/Marak/faker.js/blob/master/lib/locales/fr/name/first_name.js
    this.names =  [
      'Enzo',
      'Lucas',
      'Mathis',
      'Nathan',
      'Thomas',
      'Hugo',
      'Théo',
      'Tom',
      'Louis',
      'Raphaël',
      'Clément',
      'Léo',
      'Mathéo',
      'Maxime',
      'Alexandre',
      'Antoine',
      'Yanis',
      'Paul',
      'Baptiste',
      'Alexis',
      'Gabriel',
      'Arthur',
      'Jules',
      'Ethan',
      'Noah',
      'Quentin',
      'Axel',
      'Evan',
      'Mattéo',
      'Romain',
      'Valentin',
      'Maxence',
      'Noa',
      'Adam',
      'Nicolas',
      'Julien',
      'Mael',
      'Pierre',
      'Rayan',
      'Victor',
      'Mohamed',
      'Adrien',
      'Kylian',
      'Sacha',
      'Benjamin',
      'Léa',
      'Clara',
      'Manon',
      'Chloé',
      'Camille',
      'Ines',
      'Sarah',
      'Jade',
      'Lola',
      'Anaïs',
      'Lucie',
      'Océane',
      'Lilou',
      'Marie',
      'Eva',
      'Romane',
      'Lisa',
      'Zoe',
      'Julie',
      'Mathilde',
      'Louise',
      'Juliette',
      'Clémence',
      'Célia',
      'Laura',
      'Lena',
      'Maëlys',
      'Charlotte',
      'Ambre',
      'Maeva',
      'Pauline',
      'Lina',
      'Jeanne',
      'Lou',
      'Noémie',
      'Justine',
      'Louna',
      'Elisa',
      'Alice',
      'Emilie',
      'Carla',
      'Maëlle',
      'Alicia',
      'Mélissa'
    ];
  });
