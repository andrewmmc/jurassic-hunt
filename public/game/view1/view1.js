'use strict';

angular.module('myApp.view1', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl' 
        });
    }])
    .controller('View1Ctrl', ['$scope', '$window', '$location', 'socket', function($scope, $compile, $location, socket) {
        $scope.windowWidth = 640;
        $scope.gameHeight = 360;
        $scope.randomNumber = Math.random();

        $scope.urlObject = $location.search();

        // Initialize the player object
        $scope.score = [0, 0];
        $scope.lifesCount = [5, 5];
        $scope.coinCount = [0, 0];
        $scope.gameOver = [false, false];
        $scope.waiting = [false, false];
        $scope.takingEffect = ['', ''];
        $scope.multiplayer = false;
        $scope.multiplayer = $scope.urlObject.multiplayer;

        socket.on("update player random", function(data) {
            $scope.randomNumber = data;
            console.log("Updated Random Number");
        });

        if ($scope.urlObject.player === 'player01') {
            socket.emit("new player", {
                id: 0,
                score: $scope.score[0],
                lifesCount: $scope.lifesCount[0],
                coinCount: $scope.coinCount[0],
                gameOver: $scope.gameOver[0]
            });

            $scope.$watch('score[0]', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    socket.emit("update player score", {
                        id: 0,
                        score: newValue
                    });
                }
            });

            $scope.$watch('lifesCount[0]', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    socket.emit("update player lifesCount", {
                        id: 0,
                        lifesCount: newValue
                    });
                }
            });

            $scope.$watch('coinCount[0]', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    socket.emit("update player coinCount", {
                        id: 0,
                        coinCount: newValue
                    });
                }
            });

            $scope.$watch('gameOver[0]', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    socket.emit("update player gameOver", {
                        id: 0,
                        gameOver: newValue
                    });
                }
            });

            $scope.$watch('randomNumber', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    socket.emit("update player random", {
                        data: newValue
                    });
                }
            });

            /*$scope.$watch('waiting[0]', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    socket.emit("update player waiting", {
                        id: 0,
                        waiting: newValue
                    });
                }
            });*/

        } else if ($scope.urlObject.player === 'player02') {

            socket.emit("new player", {
                id: 1,
                score: $scope.score[1],
                lifesCount: $scope.lifesCount[1],
                coinCount: $scope.coinCount[1],
                gameOver: $scope.gameOver[1]
            });

            $scope.$watch('score[1]', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    socket.emit("update player score", {
                        id: 1,
                        score: newValue
                    });
                }
            });

            $scope.$watch('lifesCount[1]', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    socket.emit("update player lifesCount", {
                        id: 1,
                        lifesCount: newValue
                    });
                }
            });

            $scope.$watch('coinCount[1]', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    socket.emit("update player coinCount", {
                        id: 1,
                        coinCount: newValue
                    });
                }
            });

            $scope.$watch('gameOver[1]', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    socket.emit("update player gameOver", {
                        id: 1,
                        gameOver: newValue
                    });
                }
            });

            /* $scope.$watch('waiting[1]', function(newValue, oldValue) {
                 if (newValue != oldValue) {
                     socket.emit("update player waiting", {
                         id: 1,
                         waiting: newValue
                     });
                 }
             });*/
        }

        // Will Take effect to opposite player only (io.sockets.emit)
        // 
        /*socket.on("update player waiting", function(data) {
            $scope.waiting[data.id] = data.waiting;
        });*/

        socket.on("update player score", function(data) {
            if (data.id === 1 && $scope.urlObject.player === 'player01') {
                $scope.score[data.id] = data.score;
            } else if (data.id === 0 && $scope.urlObject.player === 'player02') {
                $scope.score[data.id] = data.score;
            }
        });

        socket.on("update player lifesCount", function(data) {
            if (data.id === 1 && $scope.urlObject.player === 'player01') {
                $scope.lifesCount[data.id] = data.lifesCount;
            } else if (data.id === 0 && $scope.urlObject.player === 'player02') {
                $scope.lifesCount[data.id] = data.lifesCount;
            }

        });

        socket.on("update player coinCount", function(data) {
            if (data.id === 1 && $scope.urlObject.player === 'player01') {
                $scope.coinCount[data.id] = data.coinCount;
            } else if (data.id === 0 && $scope.urlObject.player === 'player02') {
                $scope.coinCount[data.id] = data.coinCount;
            }
        });

        socket.on("update player gameOver", function(data) {
            if (data.id === 1 && $scope.urlObject.player === 'player01') {
                $scope.gameOver[data.id] = data.gameOver;
            } else if (data.id === 0 && $scope.urlObject.player === 'player02') {
                $scope.gameOver[data.id] = data.gameOver;
            }
        });

        socket.on("update player random", function(data) {
            $scope.randomNumber = data;
        });


    }]);
