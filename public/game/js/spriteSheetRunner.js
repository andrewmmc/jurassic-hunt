myDirectives.directive('spriteSheetRunner', ['loaderSvc', 'Sky', 'Ground', 'Hill', 'Character', function(loaderSvc, Sky, Ground, Hill, Character) {
    "use strict";
    return {
        restrict: 'EAC',
        replace: true,
        scope: {
            width: '=width',
            height: '=height',
            score: '=score',
            lifesCount: '=lifesCount'
        },
        template: "<canvas style='width:100%;height:100%'></canvas>",
        link: function(scope, element, attribute) {
            var w, h, sky, grant, ground, hill, hill2, hill3, hill4, runningSoundInstance;
            var health=0;
            var scoreTotal=0;
            var scoreInfo = "";
            var tempBitMap = "";
            var gameStatus ="";
            drawGame();
            element[0].width = scope.width;
            element[0].height = scope.height;
            w = scope.width;
            h = scope.height;

            function drawGame() {
                //drawing the game canvas from scratch here
                if (scope.stage) {
                    scope.stage.autoClear = true;
                    scope.stage.removeAllChildren();
                    scope.stage.update();
                } else {
                    scope.stage = new createjs.Stage(element[0]);
                }
                w = scope.stage.canvas.width;
                h = scope.stage.canvas.height;
                loaderSvc.getLoader().addEventListener("complete", handleComplete);
                loaderSvc.loadAssets();
            }

            function healthUI() {
                if (scope.lifesCount>0){
                    health = scope.lifesCount;
                    var img = new Image();
                    img.src = "assets/heart2.png";
                    img.onload = function (){
                        for(var i = 0;i<scope.lifesCount;i++){
                            tempBitMap = new createjs.Bitmap(img);
                            tempBitMap.x = 12+i*60;
                            tempBitMap.y = 10;
                            tempBitMap.scaleX =0.045;
                            tempBitMap.scaleY =0.045;
                            tempBitMap.shadow = new createjs.Shadow("#444", 5, 5, 14);
                            scope.stage.addChild(tempBitMap);
                        }
                    }
                }
            }
            
            function healthUpdate(){
                if (health != scope.lifesCount) {
                    for(var i = 0;i<health;i++){
                    scope.stage.removeChildAt(7);
                    }
                    healthUI();
                }
            }
            
            function scoreUI() {
                scoreInfo = new createjs.Text("Score:"+scope.score, "bold 28px Courier", "#ffffff");
                scoreInfo.shadow = new createjs.Shadow("#444", 5, 5, 10);
                scoreInfo.x = w-206;
                scoreInfo.y = 18;
                scope.stage.addChild(scoreInfo);
            }
            
            function scoreUpdate() {
                scope.stage.removeChild(scoreInfo);
                scoreUI();
            }
            
            function pauseUI(){
                var img = new Image();
                gameStatus = new createjs.Text("", "bold 100px Courier", "#ffffff");
                img.src = "assets/pause.png";
                img.onload = function (){
                    var pauseButton = new createjs.Bitmap(img);
                    pauseButton.x = w/2;
                    pauseButton.y = 6;
                    pauseButton.scaleX =0.06;
                    pauseButton.scaleY =0.06;
                    pauseButton.shadow = new createjs.Shadow("#000", 1, 1, 2);
                    scope.stage.addChild(pauseButton);
                    pauseButton.addEventListener("click", handleClick);
                    gameStatus.shadow = new createjs.Shadow("#000", 8, 10, 32);
                    gameStatus.x=w/4-10;
                    gameStatus.y=100;
                    scope.stage.addChild(gameStatus);
                    function handleClick(event) {
                        createjs.Sound.stop();
                        if (scope.status != "paused"){
                            scope.stage.removeChild(pauseButton);
                            gameStatus.text="Paused";
                            scope.stage.update();
                        }
                        createjs.Ticker.removeEventListener("tick", tick);
                        scope.status = "paused";
                    }
                }
            }
            
            function handleComplete() {
                sky = new Sky({
                    width: w,
                    height: h
                });
                sky.addToStage(scope.stage);
                ground = new Ground({
                    width: w,
                    height: h
                });
                hill = new Hill({
                    width: w,
                    height: h,
                    scaleFactor: 1,
                    assetName: 'hill',
                    groundHeight: ground.getHeight()
                });
                //hill.setAlpha(0.5);
                hill.setX(200);
                hill.addToStage(scope.stage);
                hill2 = new Hill({
                    width: w,
                    height: h,
                    scaleFactor: 1,
                    assetName: 'hill2',
                    groundHeight: ground.getHeight()
                });
                hill2.setX(400);
                hill2.addToStage(scope.stage);
                hill3 = new Hill({
                    width: w,
                    height: h,
                    scaleFactor: 1,
                    assetName: 'hill3',
                    groundHeight: ground.getHeight()
                });
                hill3.setX(650);
                hill3.addToStage(scope.stage);
                hill4 = new Hill({
                    width: w,
                    height: h,
                    scaleFactor: 1,
                    assetName: 'hill4',
                    groundHeight: ground.getHeight()
                });
                hill4.setX(850);
                hill4.addToStage(scope.stage);
                ground.addToStage(scope.stage);
                
                grant = new Character({
                    characterAssetName: 'grant',
                    y: 34
                });
                grant.addToStage(scope.stage);

                scope.stage.addEventListener("stagemousedown", handleJumpStart);
                createjs.Ticker.timingMode = createjs.Ticker.RAF;
                createjs.Ticker.addEventListener("tick", tick);
                // start playing the running sound looping indefinitely
                runningSoundInstance = createjs.Sound.play("runningSound", {
                    loop: -1
                });
                pauseUI();
                healthUI();
                scoreUI();
                
                scope.status = "running";
                window.onkeydown = keydown;
                scope.$apply();
            }

            function keydown(event) {
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
            }

            function handleJumpStart() {
                if (scope.status === "paused") {
                        createjs.Ticker.addEventListener("tick", tick);
                        runningSoundInstance = createjs.Sound.play("runningSound", {
                            loop: -1
                        });
                        scope.stage.removeChild(gameStatus);
                        pauseUI();
                        scope.status = "running";
                        grant.playAnimation("run");
                    }
                else if (scope.status != "paused"){
                    if (scope.status === "running") {
                        createjs.Sound.play("jumpingSound");
                        grant.playAnimation("jump");
                    }
                }
            }

            function tick(event) {
                var deltaS = event.delta / 1000;
                //var position = grant.getX() + 150 * deltaS;
                grant.setX(80);
                //grant.setX((position >= w + grant.getWidth()) ? -grant.getWidth() : position);
                //ground.setX((ground.getX() - deltaS * 150) % ground.getTileWidth());
                hill.move(deltaS * -30, 0);
                if (hill.getX() + hill.getImageWidth() * hill.getScaleX() <= 0) {
                    hill.setX(w + 200);
                }
                hill2.move(deltaS * -30, 0);
                if (hill2.getX() + hill2.getImageWidth() * hill2.getScaleX() <= 0) {
                    hill2.setX(w + 400);
                }
                hill3.move(deltaS * -30, 0);
                if (hill3.getX() + hill3.getImageWidth() * hill3.getScaleX() <= 0) {
                    hill3.setX(w + 650);
                }
                hill4.move(deltaS * -30, 0);
                if (hill4.getX() + hill4.getImageWidth() * hill4.getScaleX() <= 0) {
                    hill4.setX(w + 850);
                }
                /*hill.move(deltaS * -30, 0);
                hill2.move(deltaS * -30, 0);
                hill3.move(deltaS * -30, 0);
                hill4.move(deltaS * -30, 0);
                if ((hill.getX() + hill.getImageWidth() * hill.getScaleX()) &&
                    (hill2.getX() + hill2.getImageWidth() * hill2.getScaleX()) &&
                    (hill3.getX() + hill3.getImageWidth() * hill3.getScaleX()) &&
                    (hill4.getX() + hill4.getImageWidth() * hill4.getScaleX()) <= 0) {
                    hill.setX(w + 200);
                    hill2.setX(w + 400);
                    hill3.setX(w + 650);
                    hill4.setX(w + 850);
                }*/
                scope.score+=10;
                healthUpdate();
                scoreUpdate();
                scope.stage.update(event);
            }
        }
    };
}]);
