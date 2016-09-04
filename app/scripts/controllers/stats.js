'use strict';

/**
 * @ngdoc function
 * @name gestionairFrontendApp.controller:OnboardingCtrl
 * @description
 * # OnboardingCtrl
 * Controller of the gestionairFrontendApp
 */
angular.module('gestionairFrontendApp')
    .controller('StatsCtrl', function ($http) {
        var $ctrl = this;
        $ctrl.invSort = '-stock';
        $ctrl.invSort2 = 'name';
        $http.get('/game/api/stats').then(function (response) {
            $ctrl.data = response.data;
            $ctrl.attendance = {};
            $ctrl.attendance.labels = Object.keys($ctrl.data.attendance).sort();
            $ctrl.attendance.total = 0;
            $ctrl.attendance.data = [$ctrl.attendance.labels.map(function (key) {
                var val = $ctrl.data.attendance[key];
                $ctrl.attendance.total += parseInt(val);
                return val;
            })];
            $ctrl.attendance.datasetOverride = [{
                backgroundColor: $ctrl.attendance.labels.map(function () {
                    return '#0098d8';
                }),
                borderWidth: 0
            }];
            // fix bugged chart
            var h = '00' + (parseInt($ctrl.attendance.labels[$ctrl.attendance.labels.length-1].match(/ (.*):/)[1]) + 1);
            h = h.substr(h.length - 2);

            $ctrl.attendance.labels.push($ctrl.data.day + ' ' + h + ':00');
            $ctrl.attendance.data[0].push(0);

            $ctrl.attendance.options = {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'HH:mm'
                            },
                        },
                    }],
                },
                title: {
                    display: true,
                },
                tooltips: {
                    enabled: false
                },
                hover: {
                    animationDuration: 0,
                },
                animation: {
                    duration: 0,
                    onComplete: function () {
                        // render the value of the chart above the bar
                        var ctx = this.chart.ctx;
                        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
                        ctx.fillStyle = this.chart.config.options.defaultFontColor;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        this.data.datasets.forEach(function (dataset) {
                            for (var i = 0; i < dataset.data.length; i++) {
                                var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                                ctx.fillText(dataset.data[i], model.x, model.y - 5);
                            }
                        });
                    }
                }
            };

            $ctrl.gains = {
                labels: ['Prix roue (' + $ctrl.data.stats.win.wheel + ')',
                         'Prix de consolation (' + $ctrl.data.stats.win.free + ')'],
                data: [[$ctrl.data.stats.win.wheel, $ctrl.data.stats.win.free]],
                datasetOverride: [{
                    backgroundColor: ['#0098d8', '#92c118'],
                    borderColor: ['#fff', '#fff']
                }],
                options: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            };

            $ctrl.scores = {
                data: [Object.keys($ctrl.data.stats.scores).map(function (key) {
                    return {
                        x: parseInt(key),
                        y: $ctrl.data.stats.scores[key],
                        r: 10
                    };
                })],
                datasetOverride: [{
                    backgroundColor: '#0098d8'
                }],
                options: {
                }
            };
        });
    });
