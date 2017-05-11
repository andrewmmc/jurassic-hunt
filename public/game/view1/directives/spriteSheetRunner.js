myDirectives.directive('spriteSheetRunner', ['loaderSvc', 'Sky', 'Ground', 'Platform', 'Coin',
    'Egg', 'Block', 'Tree', 'Character', 'socket',
    function(loaderSvc, Sky, Ground, Platform, Coin, Egg, Block, Tree, Character, socket) {
        "use strict";
        return {
            restrict: 'EAC',
            replace: true,
            scope: {
                width: '=width',
                height: '=height',
                score: '=score',
                lifesCount: '=lifesCount',
                coinCount: '=coinCount',
                urlObject: '=urlObject',
                gameOver: '=gameOver',
                randomNumber: '=randomNumber',
                waiting: '=waiting',
                multiplayer: '=multiplayer',
                takingEffect: '=takingEffect'
            },
            template: "<canvas style='width: 100vw; height: 100vh'></canvas>",
            link: function(scope, element, attribute) {
                ndgmr.DEBUG_COLLISION = true;
                var frame = 0;
                var effectCount = 0;
                var randomframe = 0;

                window.JMP = window.JMP || {};

                window.JMP.CW = w = element[0].width = scope.width;
                window.JMP.CH = h = element[0].height = scope.height;
                window.JMP.S = Math.min(JMP.CW / 1024, JMP.CH / 768);
                window.JMP.S = ndgmr.snapValue(JMP.S * (window.devicePixelRatio || 1), 0.5);

                var w, h, sky, ground, runningSoundInstance;
                var grant = [],
                    platform = [],
                    egg = [],
                    coin = [],
                    block = [],
                    tree = [];
                var gameStart = false;
                var pWidth = 250, // Add platform width here
                    numPlatforms = Math.ceil(JMP.CW / (pWidth * 1.5)) + 1;

                drawGame();

                function drawGame() {
                    //drawing the game canvas from scratch here
                    if (scope.stage) {
                        scope.stage.autoClear = true;
                        scope.stage.removeAllChildren();
                        scope.stage.update();
                    } else {
                        scope.stage = new createjs.Stage(element[0]);
                        scope.stage.snapToPixelEnabled = true;
                    }
                    createjs.Touch.enable(scope.stage); // Support touch device at same time

                    w = scope.stage.canvas.width;
                    h = scope.stage.canvas.height;

                    // Load game assets
                    loaderSvc.getLoader().addEventListener("complete", handleComplete);
                    loaderSvc.loadAssets();
                }

                function handleComplete() {
                    // Adding game background to the game canvas
                    sky = new Sky({
                        width: w,
                        height: h,
                        JMPCW: window.JMP.CW,
                        JMPCH: window.JMP.CH,
                        JMPS: window.JMP.S
                    });
                    sky.addToStage(scope.stage);

                    /*ground = new Ground({
                        width: w,
                        height: h
                    });
                    ground.addToStage(scope.stage);*/
                    tree[0] = new Tree({
                        width: w,
                        height: h,
                        x: 100,
                        y: 40,
                        assetName: 'cloud'
                    });
                    tree[0].addToStage(scope.stage);
                    tree[1] = new Tree({
                        width: w,
                        height: h,
                        x: 220,
                        y: 65,
                        assetName: 'cloud'
                    });
                    tree[1].addToStage(scope.stage);
                    tree[2] = new Tree({
                        width: w,
                        height: h,
                        x: 330,
                        y: 45,
                        assetName: 'cloud'
                    });
                    tree[2].addToStage(scope.stage);
                    tree[3] = new Tree({
                        width: w,
                        height: h,
                        x: 450,
                        y: 55,
                        assetName: 'cloud'
                    });
                    tree[3].addToStage(scope.stage);
                    tree[4] = new Tree({
                        width: w,
                        height: h,
                        x: 570,
                        y: 65,
                        assetName: 'cloud'
                    });
                    tree[4].addToStage(scope.stage);
                    tree[5] = new Tree({
                        width: w,
                        height: h,
                        x: 680,
                        y: 45,
                        assetName: 'cloud'
                    });
                    tree[5].addToStage(scope.stage);
                    tree[6] = new Tree({
                        width: w,
                        height: h,
                        x: 790,
                        y: 40,
                        assetName: 'cloud'
                    });
                    tree[6].addToStage(scope.stage);

                    // Adding game world to the game canvas
                    scope.world = new createjs.Container();
                    scope.world.snapToPixel = true;
                    scope.stage.addChild(scope.world);

                    // Adding collision layer to game world
                    scope.collisionContainer = new createjs.Container();
                    scope.collisionContainer.snapToPixel = true;
                    scope.world.addChild(scope.collisionContainer);

                    grant[0] = new Character({
                        characterAssetName: 'grant0',
                        x: 0,
                        y: 100,
                        JMPS: window.JMP.S
                    });
                    scope.collisionContainer.addChild(grant[0].addToStage());

                    if (scope.urlObject.player === 'player01') {
                        socket.emit("new player1 pos", {
                            id: 0,
                            x: grant[0].getX(),
                            y: grant[0].getY(),
                            vx: grant[0].getVelocity().x,
                            vy: grant[0].getVelocity().y
                        });
                    }
                    if (scope.multiplayer) {

                        grant[1] = new Character({
                            characterAssetName: 'grant1',
                            x: 100,
                            y: 100,
                            JMPS: window.JMP.S
                        });
                        scope.collisionContainer.addChild(grant[1].addToStage());

                        if (scope.urlObject.player === 'player02') {
                            socket.emit("new player2 pos", {
                                id: 1,
                                x: grant[1].getX(),
                                y: grant[1].getY(),
                                vx: grant[1].getVelocity().x,
                                vy: grant[1].getVelocity().y
                            });
                        }
                    }

                    for (var c = 0; c < numPlatforms; c++) {
                        platform[c] = new Platform({
                            width: w,
                            height: h,
                            assetName: 'platform',
                            JMP: JMP.CH,
                            randomNumber: scope.randomNumber
                        });
                        scope.collisionContainer.addChild(platform[c].returnPlatform());
                        block[c] = new Block({
                            width: w,
                            height: h,
                            assetName: 'block',
                            JMP: JMP.CH,
                            randomNumber: scope.randomNumber
                        });
                        scope.collisionContainer.addChild(block[c].returnBlock());
                        coin[c] = new Coin({
                            width: w,
                            height: h,
                            assetName: 'coin',
                            JMP: JMP.CH,
                            randomNumber: scope.randomNumber
                        });
                        scope.collisionContainer.addChild(coin[c].returnCoin());
                        egg[c] = new Egg({
                            width: w,
                            height: h,
                            assetName: 'egg',
                            JMP: JMP.CH,
                            randomNumber: scope.randomNumber
                        });
                        scope.collisionContainer.addChild(egg[c].returnEgg());
                    }

                    scope.status = "running";
                    //window.onkeydown = keydown;

                    scope.stage.addEventListener("stagemousedown", handleJumpStart);
                    //createjs.Ticker.timingMode = createjs.Ticker.RAF;
                    createjs.Ticker.setFPS(30);
                    //createjs.Ticker.addEventListener("tick", tick);
                    createjs.Ticker.addEventListener("tick", start);

                    // start playing the running sound looping indefinitely
                    runningSoundInstance = createjs.Sound.play("runningSound", {
                        loop: -1
                    });

                    if (scope.urlObject.player === 'player01') {
                        scope.waiting[0] = true;
                    }
                    if (scope.urlObject.player === 'player02') {
                        scope.waiting[1] = true;
                    }
                }

                /*function keydown(event) {
                    if (event.keyCode === 38) { //if keyCode is "Up"
                        handleJumpStart();
                    }
                    if (event.keyCode === 39) { //if keyCode is "Right"
                        if (scope.status === "paused") {
                            createjs.Ticker.addEventListener("tick", tick);
                            runningSoundInstance = createjs.Sound.play("runningSound", {
                                loop: -1
                            });
                            scope.status = "running";
                        }
                    }
                    if (event.keyCode === 37) { //if keyCode is "Left"
                        createjs.Ticker.removeEventListener("tick", tick);
                        createjs.Sound.stop();
                        scope.status = "paused";
                    }
                }*/

                function handleJumpStart() {
                    if (scope.status === "running") {
                        createjs.Sound.play("jumpingSound");

                        if (scope.urlObject.player === 'player01') {
                            grant[0].jump();
                            //grant[0].reset(); // Delete this later
                            grant[0].playAnimation("jump");
                            socket.emit("update player1 pos", {
                                id: 0,
                                x: grant[0].getX(),
                                y: grant[0].getY(),
                                vx: grant[0].getVelocity().x,
                                vy: grant[0].getVelocity().y,
                            });
                        } else if (scope.urlObject.player === 'player02') {
                            grant[1].jump();
                            //grant[1].reset(); // Delete this later
                            grant[1].playAnimation("jump");
                            socket.emit("update player2 pos", {
                                id: 1,
                                x: grant[1].getX(),
                                y: grant[1].getY(),
                                vx: grant[1].getVelocity().x,
                                vy: grant[1].getVelocity().y,
                            });
                        } else {
                            //Error, missing p
                        }
                    }
                }

                /*setInterval(function() {
                    // Check two player status and start
                    // Add Loading here
                    if (scope.multiplayer && !gameStart && scope.waiting[0] === true && scope.waiting[1] === true) {
                        createjs.Ticker.addEventListener("tick", tick);
                        gameStart = true;
                    }
                }, 1);*/
                function start(event) {
                    if (!gameStart) {
                        if (scope.urlObject.player === 'player01') {
                            socket.emit('update player waiting', {
                                id: 0,
                                waiting: scope.waiting[0]
                            });
                        }
                        if (scope.urlObject.player === 'player02') {
                            socket.emit('update player waiting', {
                                id: 1,
                                waiting: scope.waiting[1]
                            });
                        }
                        socket.on("update player waiting", function(data) {
                            scope.waiting[data.id] = data.waiting;
                        });
                        if (scope.multiplayer && scope.waiting[0] === true && scope.waiting[1] === true) {
                            createjs.Ticker.addEventListener("tick", tick);
                            gameStart = true;
                        } else if (!scope.multiplayer) {
                            createjs.Ticker.addEventListener("tick", tick);
                            gameStart = true;
                        }
                    }
                }

                function tick(event) {

                    if (scope.multiplayer && !gameStart && (scope.waiting[0] === false || scope.waiting[1] === false)) {
                        createjs.Ticker.removeEventListener("tick", tick);
                        gameStart = false;
                    }

                    /*if (scope.urlObject.player === 'player01' && randomframe < 1) {
                        randomframe++;
                    }
                    if (scope.urlObject.player === 'player01' && randomframe === 1) {
                        scope.randomNumber = Math.random();
                        socket.emit('update player random', scope.randomNumber);
                        randomframe = 0;
                    }*/

                    var deltaS = event.delta / 1000;
                    if (scope.urlObject.player === 'player01') {
                        //Scrolling the game world
                        scope.world.x = -grant[0].getX() + JMP.CW * 0.2;
                        var p = grant[0].localToGlobal(0, 0);
                        if (p.y > JMP.CH * 0.6) {
                            scope.world.y = -grant[0].getY() + JMP.CH * 0.6; //0.6
                        } else if (p.y < JMP.CH * 0.2) {
                            scope.world.y = -grant[0].getY() + JMP.CH * 0.2; //0.2
                        }
                    } else if (scope.urlObject.player === 'player02') {
                        //console.log(grant[1]);
                        scope.world.x = -grant[1].getX() + JMP.CW * 0.2;
                        var p = grant[1].localToGlobal(0, 0);
                        if (p.y > JMP.CH * 0.6) {
                            scope.world.y = -grant[1].getY() + JMP.CH * 0.6; //0.6
                        } else if (p.y < JMP.CH * 0.2) {
                            scope.world.y = -grant[1].getY() + JMP.CH * 0.2; //0.2
                        }
                    } else {
                        //Error, missing p
                    }

                    //Move the game player
                    grant[0].onTick(scope);
                    if (scope.multiplayer) {
                        grant[1].onTick(scope);
                        console.log('now player 01' + grant[0].getX() + ',' + grant[0].getY() + ',' + grant[0].getVelocity().x + ',' + grant[0].getVelocity().y);

                        console.log('now player 02' + grant[1].getX() + ',' + grant[1].getY() + ',' + grant[1].getVelocity().x + ',' + grant[1].getVelocity().y);

                        if (scope.urlObject.player === 'player01') {
                            socket.on("update player2 pos", function(data) {
                                grant[1].setX(data.x);
                                //if (data.y !== undefined && data.vx !== undefined && data.vy !== undefined) {
                                grant[1].setY(data.y);
                                grant[1].setVelocity(data.vx, data.vy);
                                //}
                                console.log('rec player 02' + data.x + ',' + data.y + ',' + data.vx + ',' + data.vy);
                                console.log('set player 02' + grant[1].getX() + ',' + grant[1].getY() + ',' + grant[1].getVelocity().x + ',' + grant[1].getVelocity().y);
                            });
                        } else if (scope.urlObject.player === 'player02') {
                            socket.on("update player1 pos", function(data) {
                                grant[0].setX(data.x);
                                //if (data.y !== undefined && data.vx !== undefined && data.vy !== undefined) {
                                grant[0].setY(data.y);
                                grant[0].setVelocity(data.vx, data.vy);
                                //}
                                console.log('rec player 01' + data.x + ',' + data.y + ',' + data.vx + ',' + data.vy);
                                console.log('set player 01' + grant[0].getX() + ',' + grant[0].getY() + ',' + grant[0].getVelocity().x + ',' + grant[0].getVelocity().y);
                            });
                        }
                    }

                    if (scope.urlObject.player === 'player01' && frame === 15 && grant[0].getVelocity().y === 0) {
                        console.log('send out player01 update' + grant[0].getX() + ',' + grant[0].getX());
                        socket.emit("update player1 pos", {
                            id: 0,
                            x: grant[0].getX(),
                            y: grant[0].getY(),
                            vx: grant[0].getVelocity().x,
                            vy: grant[0].getVelocity().y,
                        });
                    } else if (scope.urlObject.player === 'player02' && frame === 15 && grant[1].getVelocity().y === 0) {
                        console.log('sendoutplayer02' + grant[1].getX() + ',' + grant[1].getX());
                        socket.emit("update player2 pos", {
                            id: 1,
                            x: grant[1].getX(),
                            y: grant[1].getY(),
                            vx: grant[1].getVelocity().x,
                            vy: grant[1].getVelocity().y,
                        });
                    }

                    frame++;

                    if (scope.urlObject.player === 'player01' && frame === 30 && !scope.gameOver[0]) { // Do when one second
                        scope.score[0] = grant[0].returnCurrentDistance();
                        frame = 0;
                        scope.$apply();
                    } else if (scope.urlObject.player === 'player02' && frame === 30 && !scope.gameOver[1]) {
                        scope.score[1] = grant[1].returnCurrentDistance();
                        frame = 0;
                        scope.$apply();
                    }

                    //If player taking effect
                    if (scope.urlObject.player === 'player01' && grant[0].returnEffectStatus() === true &&
                        effectCount < 150) { // Effect hold 5 seconds only
                        if (grant[0].returnSpeedUp()) {
                            createjs.Sound.play("speedup");
                            scope.takingEffect[0] = "Speed up!";
                        } else if (grant[0].returnSpeedDown()) {
                            createjs.Sound.play("slowdown");
                            scope.takingEffect[0] = "Speed down!";
                        } else if (grant[0].returnUnlimitedJump()) {
                            createjs.Sound.play("super");
                            scope.takingEffect[0] = "Unlimited jump!";
                        } else if (grant[0].returnPowerful()) {
                            createjs.Sound.play("super");
                            scope.takingEffect[0] = "Powerful!";
                        }
                        effectCount++;
                    } else if (scope.urlObject.player === 'player01' && grant[0].returnEffectStatus() === true &&
                        effectCount >= 150) { // Effect hold 5 seconds only
                        grant[0].resetEgg();
                    } else if (scope.urlObject.player === 'player02' && grant[1].returnEffectStatus() === true &&
                        effectCount < 150) { // Effect hold 5 seconds only
                        if (grant[1].returnSpeedUp()) {
                            createjs.Sound.play("speedup");
                            scope.takingEffect[1] = "Speed up!";
                        } else if (grant[1].returnSpeedDown()) {
                            createjs.Sound.play("slowdown");
                            scope.takingEffect[1] = "Speed down!";
                        } else if (grant[1].returnUnlimitedJump()) {
                            createjs.Sound.play("super");
                            scope.takingEffect[1] = "Unlimited jump!";
                        } else if (grant[0].returnPowerful()) {
                            createjs.Sound.play("super");
                            scope.takingEffect[0] = "Powerful";
                        }
                        effectCount++;
                    } else if (scope.urlObject.player === 'player02' && grant[1].returnEffectStatus() === true &&
                        effectCount >= 150) { // Effect hold 5 seconds only
                        grant[1].resetEgg();
                    }

                    //If got egg option 3 or 4
                    if (scope.urlObject.player === 'player01' && grant[0].returnAddHeart()) {
                        scope.lifesCount[0]++;
                        createjs.Sound.play("getcoin");
                        scope.takingEffect[0] = "One more life!";

                        grant[0].settedAddHeart();
                    } else if (scope.urlObject.player === 'player02' && grant[1].returnAddHeart()) {
                        scope.lifesCount[1]++;
                        createjs.Sound.play("getcoin");
                        scope.takingEffect[1] = "One more life!";
                        grant[1].settedAddHeart();
                    }

                    if (scope.urlObject.player === 'player01' && grant[0].returnLostMoney()) {
                        scope.coinCount[0]--;
                        createjs.Sound.play("zip");
                        scope.takingEffect[0] = "Lost coin!";
                        grant[0].settedLostMoney();
                    } else if (scope.urlObject.player === 'player02' && grant[1].returnLostMoney()) {
                        scope.coinCount[1]--;
                        createjs.Sound.play("zip");
                        scope.takingEffect[1] = "Lost coin!";
                        grant[1].settedLostMoney();
                    }

                    if (scope.urlObject.player === 'player01' && grant[0].returnEffectStatus() === false) {
                        effectCount = 0;
                        scope.takingEffect[0] = "";
                    } else if (scope.urlObject.player === 'player02' && grant[1].returnEffectStatus() === false) {
                        effectCount = 0;
                        scope.takingEffect[1] = "";
                    }

                    //Move coins, block, platform, egg
                    for (var c = 0; c < numPlatforms; c++) {
                        if ((coin[c].returnCoin()).addedCoin === true) {
                            if (scope.urlObject.player === 'player01') {
                                createjs.Sound.play("getcoin");
                                scope.coinCount[0]++;
                            } else if (scope.urlObject.player === 'player02') {
                                createjs.Sound.play("getcoin");
                                scope.coinCount[1]++;
                            } else {
                                //Error, missing p
                            }
                            scope.$apply();
                            coin[c].addedCoin();
                        }

                        if ((block[c].returnBlock()).hittedBlock === true && (block[c].returnBlock()).hurt === false) {

                            if (scope.urlObject.player === 'player01' && grant[0].returnPowerful() === false) {
                                createjs.Sound.play("zip");
                                scope.lifesCount[0]--;
                                scope.$apply();
                                block[c].hittedBlock();
                                block[c].hurt();
                            } else if (scope.urlObject.player === 'player02' && grant[1].returnPowerful() === false) {
                                createjs.Sound.play("zip");
                                scope.lifesCount[1]--;
                                scope.$apply();
                                block[c].hittedBlock();
                                block[c].hurt();
                            } else {
                                //Error, missing p
                            }
                        }
                        platform[c].onTick(JMP.CH, scope.randomNumber);
                        block[c].onTick(JMP.CH, scope.randomNumber);
                        coin[c].onTick(JMP.CH, scope.randomNumber);
                        egg[c].onTick(JMP.CH, scope.randomNumber);
                    }
                    //var position = grant.getX() + 150 * deltaS;
                    //grant.setX((position >= w + grant.getWidth()) ? -grant.getWidth() : position);
                    //ground.setX((ground.getX() - deltaS * 150) % ground.getTileWidth());

                    // Move the cloud
                    for (var i = 0; i <= 6; i++) {
                        tree[i].move(deltaS * -10, 0);
                    }
                    if (tree[0].getX() + tree[0].getImageWidth() <= 0) {
                        tree[0].setX(w + 100);
                    }

                    if (tree[1].getX() + tree[1].getImageWidth() <= 0) {
                        tree[1].setX(w + 220);
                    }
                    if (tree[2].getX() + tree[2].getImageWidth() <= 0) {
                        tree[2].setX(w + 330);
                    }
                    if (tree[3].getX() + tree[3].getImageWidth() <= 0) {
                        tree[3].setX(w + 450);
                    }
                    if (tree[4].getX() + tree[4].getImageWidth() <= 0) {
                        tree[4].setX(w + 570);
                    }
                    if (tree[5].getX() + tree[5].getImageWidth() <= 0) {
                        tree[5].setX(w + 680);
                    }
                    if (tree[6].getX() + tree[6].getImageWidth() <= 0) {
                        tree[6].setX(w + 790);
                    }

                    //Check game over
                    if (scope.urlObject.player === 'player01') {
                        if (grant[0].getY() > JMP.CH * 2 || scope.lifesCount[0] <= 0) {
                            createjs.Sound.play("gameover");
                            createjs.Ticker.removeEventListener("tick", tick);
                            createjs.Sound.stop();
                            scope.gameOver[0] = true;
                            //console.log("gameover");
                        }
                    } else if (scope.urlObject.player === 'player02') {
                        if (grant[1].getY() > JMP.CH * 2 || scope.lifesCount[1] <= 0) {
                            createjs.Sound.play("gameover");
                            createjs.Ticker.removeEventListener("tick", tick);
                            createjs.Sound.stop();
                            scope.gameOver[1] = true;
                            //console.log("gameover");
                        }
                    }
                    scope.stage.update(event);
                }
            }
        };
    }
]);
