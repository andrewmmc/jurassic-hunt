uiClasses.factory("Character", [
    'loaderSvc',
    'Coin',
    function(loaderSvc, Coin) {
        "use strict";

        function Character(obj) {
            /*var spriteSheet = new createjs.SpriteSheet({
                framerate: 30,
                "images": [loaderSvc.getResult(obj.characterAssetName)],
                "frames": {
                    "regX": 82,
                    "height": 292,
                    "count": 64,
                    "regY": 0,
                    "width": 165
                },
                // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                "animations": {
                        "run": [0, 25, "run", 1.5],
                        "jump": [26, 63, "run"]
                }
            });*/
            var spriteSheet = new createjs.SpriteSheet({
                framerate: 30,
                "images": [loaderSvc.getResult(obj.characterAssetName)],
                "frames": [
                    [2, 2, 55, 66],
                    [2, 70, 55, 66],
                    [2, 138, 55, 66],
                    [2, 206, 55, 66],
                    [2, 274, 55, 66],
                    [2, 342, 55, 66],
                    [2, 274, 55, 66],
                    [2, 206, 55, 66],
                    [2, 138, 55, 66],
                    [2, 70, 55, 66],
                    [2, 2, 55, 66],
                    [2, 410, 55, 66],
                    [2, 478, 55, 66],
                    [2, 546, 53, 74],
                    [2, 478, 55, 66],
                    [2, 410, 55, 66]
                ],
                // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                "animations": {
                    "run": [0, 10],
                    "jump": [11, 15, "run"]
                }
            });
            //this.grant = new createjs.Bitmap(loaderSvc.getResult(obj.characterAssetName));

            this.grant = new createjs.Sprite(spriteSheet, "run");
            this.grant.JMPS = obj.JMPS;
            this.grant.snapToPixel = true;
            this.grant.x = obj.x;
            this.grant.velocity = {
                x: 10,
                y: 0
            };
            this.grant.currentJump = 0;
            this.grant.maxJump = 3;
            this.grant.powerful = false;
            this.grant.takingEffect = false;
            this.grant.currentDistance = 0;
            this.grant.oldvelocityx = 0; // Record velocity.x before
            this.grant.changedvelocityx = false;
            this.grant.speedup = false;
            this.grant.speeddown = false;
            this.grant.addheart = false;
            this.grant.lostmoney = false;
            this.grant.unlimitedjump = false;
            this.reset();
        }

        Character.prototype = {
            addToStage: function() {
                return this.grant;
            },
            removeFromStage: function(stage) {
                stage.removeChild(this.grant);
            },
            getWidth: function() {
                return this.grant.getBounds().width * this.grant.scaleX;
            },
            returnPowerful: function() {
                return this.grant.powerful;
            },
            returnEffectStatus: function() {
                return this.grant.takingEffect;
            },
            returnSpeedUp: function() {
                return this.grant.speedup;
            },
            returnSpeedDown: function() {
                return this.grant.speeddown;
            },
            returnCurrentDistance: function() {
                return this.grant.currentDistance;
            },
            returnAddHeart: function() {
                return this.grant.addheart;
            },
            returnLostMoney: function() {
                return this.grant.lostmoney;
            },
            returnUnlimitedJump: function() {
                return this.grant.unlimitedjump;
            },
            settedAddHeart: function() {
                this.grant.addheart = false;
                this.grant.takingEffect = false;
            },
            settedLostMoney: function() {
                this.grant.lostmoney = false;
                this.grant.takingEffect = false;
            },
            getX: function() {
                return this.grant.x;
            },
            getY: function() {
                return this.grant.y;
            },
            getVelocity: function() {
                return this.grant.velocity;
            },
            setX: function(val) {
                this.grant.x = val;
            },
            setY: function(val) {
                this.grant.y = val;
            },
            setVelocity: function(vx, vy) {
                this.grant.velocity.x = vx;
                this.grant.velocity.y = vy;
            },
            onTick: function(scope) {
                var lastX = this.grant.x;
                this.grant.velocity.x *= 1.0001; // Make player faster every frame
                if (this.grant.velocity.x > 40) {
                    this.grant.velocity.x *= 1.001;
                } else if (this.grant.velocity.x > 60) {
                    this.grant.velocity.x *= 1.01;
                }
                this.grant.velocity.y += 1;
                this.grant.y += this.grant.velocity.y;
                var c, col, collObjs = this.grant.parent.children,
                    dir;
                for (c = 0; c < collObjs.length; c++) {
                    if (collObjs[c] == this.grant) continue;
                    col = ndgmr.checkRectCollision(this.grant, collObjs[c]);
                    //col = ndgmr.checkPixelCollision(this.grant, collObjs[c], 0, true);
                    if (col) {
                        console.log(collObjs[c].name);
                        if (collObjs[c].name == "Platform") {
                            dir = this.grant.velocity.y > 0 ? -1 : 1;
                            this.grant.y += col.height * dir;
                            this.grant.velocity.y = 0;
                            if (dir == -1) {
                                this.grant.currentJump = 0;
                            }
                        } else if (collObjs[c].name == "Coin") {
                            if (!collObjs[c].addedCoin && collObjs[c].visible) {
                                collObjs[c].addedCoin = true;
                            }
                            collObjs[c].visible = false;
                        } else if (collObjs[c].name == "Block") {
                            if (!collObjs[c].hittedBlock && collObjs[c].visible) {
                                collObjs[c].hittedBlock = true;
                            }
                        } else if (collObjs[c].name == "Egg") {
                            console.log('egg');
                            if (!collObjs[c].addedEgg && collObjs[c].visible) {
                                collObjs[c].addedEgg = true;
                                this.grant.takingEffect = true;
                                var rand_no = Math.floor(scope.randomNumber * 6 + 1);
                                switch (rand_no) {
                                    case 1:
                                        console.log("Speed Up");
                                        collObjs[c].visible = false;
                                        this.changedvelocityx = true;
                                        this.oldvelocityx = this.grant.velocity.x;
                                        this.grant.velocity.x = 15;
                                        this.grant.speedup = true;
                                        break;
                                    case 2:
                                        console.log("Speed Down");
                                        collObjs[c].visible = false;
                                        this.changedvelocityx = true;
                                        this.oldvelocityx = this.grant.velocity.x;
                                        this.grant.velocity.x = 5;
                                        this.grant.speeddown = true;
                                        break;
                                    case 3:
                                        console.log("Add Heart");
                                        collObjs[c].visible = false;
                                        this.grant.addheart = true;
                                        break;
                                    case 4:
                                        console.log("Lost Money");
                                        collObjs[c].visible = false;
                                        this.grant.lostmoney = true;
                                        break;
                                    case 5:
                                        console.log("Powerful");
                                        collObjs[c].visible = false;
                                        this.grant.powerful = true;
                                        break;
                                    case 6:
                                        console.log("Unlimited Jump");
                                        collObjs[c].visible = false;
                                        this.grant.unlimitedjump = true;
                                        this.grant.maxJump = 999999;
                                        break;
                                    default:
                                        console.log("No Effect");
                                }
                            }
                        }
                        break;
                    }
                }

                this.grant.x += this.grant.velocity.x;
                for (c = 0; c < collObjs.length; c++) {
                    if (collObjs[c] == this.grant) continue;
                    col = ndgmr.checkRectCollision(this.grant, collObjs[c]);
                    //if (col) {
                    //this.grant.x -= col.width;
                    if (col && col.height > 1) {
                        this.x -= Math.ceil(col.width);
                        break;
                    }
                }
                var movedX = this.grant.x - lastX;
                this.grant.currentDistance += Math.round(movedX * 0.05 * (1 / this.grant.JMPS));
            },
            jump: function() {
                if (this.grant.currentJump < this.grant.maxJump) {
                    this.grant.velocity.y = -10;
                    this.grant.currentJump++;
                }
            },
            reset: function() {
                this.currentJump = 0;
                this.grant.velocity.y = -10;
            },
            resetEgg: function() {
                //Reset all the powerful changed stuff!
                if (this.changedvelocityx) {
                    this.grant.velocity.x = this.oldvelocityx;
                }
                this.grant.takingEffect = false;
                this.grant.powerful = false;
                this.grant.changedvelocityx = false;
                this.grant.unlimitedjump = false;
                this.grant.maxJump = 3;
                this.grant.speedup = false;
                this.grant.speeddown = false;
            },
            playAnimation: function(animation) {
                this.grant.gotoAndPlay(animation);
            },
            localToGlobal: function(x, y) {
                return this.grant.localToGlobal(x, y);
            }
        };

        return (Character);
    }
]);
