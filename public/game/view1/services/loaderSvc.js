myServices.service('loaderSvc', function() {
    "use strict";
    var manifest = [{
            src: "player.png", //"spritesheet_grant.png",
            id: "grant0"
        }, {
            src: "player2.png",
            id: "grant1"
        }, {
            src: "sky.png",
            id: "sky"
        }, {
            src: "ground_land.png",
            id: "ground"
        }, {
            src: "platform.png",
            id: "platform"
        }, {
            src: "coin.png",
            id: "coin"
        }, {
            src: "egg.png",
            id: "egg"
        }, {
            src: "enemies.png",
            id: "block"
        }, {
            src: "cloud.png",
            id: "cloud"
        }, {
            src: "runningTrack.mp3",
            id: "runningSound"
        }, {
            src: "jump.mp3",
            id: "jumpingSound"
        }, {
            src: "home-bg.mp3",
            id: "homebg"
        }, {
            src: "speedup.mp3",
            id: "speedup"
        }, {
            src: "game-over.mp3",
            id: "gameover"
        }, {
            src: "button-clicked.wav",
            id: "buttonclicked"
        }, {
            src: "slow-down.wav",
            id: "slowdown"
        }, {
            src: "super.mp3",
            id: "super"
        }, {
            src: "getcoin.ogg",
            id: "getcoin"
        }, {
            src: "zip.wav",
            id: "zip"
        }],
        loader = new createjs.LoadQueue(true);

    // need this so it doesn't default to Web Audio
    createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]);
    loader.installPlugin(createjs.Sound);

    this.getResult = function(asset) {
        return loader.getResult(asset);
    };
    this.getLoader = function() {
        return loader;
    };
    this.loadAssets = function() {
        loader.loadManifest(manifest, true, "./assets/");
    };
});
