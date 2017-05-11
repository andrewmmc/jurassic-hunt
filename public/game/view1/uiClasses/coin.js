uiClasses.factory("Coin", [
    'loaderSvc', 'Platform',
    function(loaderSvc, Platform) {
        "use strict";

        function Coin(obj) {
            this.coin = new createjs.Bitmap(loaderSvc.getResult(obj.assetName));
            this.coin.name = "Coin";
            this.coin.snapToPixel = true;
            this.coin.addedCoin = false;
            this.placeLast(obj.JMP, obj.randomNumber);
        }

        Coin.lastCoin = null; // Reference to all Coins

        Coin.prototype = {
            returnCoin: function() {
                return this.coin;
            },
            addedCoin: function() {
                this.coin.addedCoin = false;
            },
            getImageWidth: function() {
                return this.coin.image.width;
            },
            getImageHeight: function() {
                return this.coin.image.height;
            },
            /*getX: function() {
                return this.coin.x;
            },
            getY: function() {
                return this.coin.y;
            },*/
            setX: function(val) {
                this.coin.x = val;
            },
            setY: function(val) { //距離 Ground 的高度, 正數表示
                this.coin.y = val;
            },
            placeLast: function(val, randomNumber) {
                this.coin.addedCoin = false;
                // Generate Coin here.
                // retrieve the last Coin
                var lastp = Coin.lastCoin,
                    w = /*this.getImageWidth()*/ 250;
                // Make the coin visable again & not yet added (if player ate the coin)
                if (randomNumber > 0.4 && randomNumber < 0.8) {
                    this.coin.visible = true;
                } else {
                    this.coin.visible = false;
                }
                //this.coin.addedCoin = false;
                // or set it do a default, in case there are none
                lastp = lastp || {
                    x: (-w * 1.7) + 100,
                    y: (val * 0.65) - 80
                };
                // place the Coin relative to the last one
                this.coin.x = Platform.lastPlatform.x + Math.floor((randomNumber * 250) + 0) /*(lastp.x + w * (Math.random() * 0.7 + 1.5))*/ ;
                this.coin.y = Platform.lastPlatform.y - Math.floor((randomNumber * 100) + 30) /*(lastp.y + val * Math.random() * 0.3 - val * 0.15)*/ ;
                // save it in the global Coin-store
                //console.log(this.coin.x, this.coin.y);
                Coin.lastCoin = this.coin;
            },
            onTick: function(val, randomNumber) {
                // get the global position
                var gp = this.coin.localToGlobal(0, 0);
                // check against the width + 5px buffer
                if (gp.x < -this.coin.image.width - 250 /* Width of platform */ ) {
                    this.placeLast(val, randomNumber);
                }
            }
        };
        return (Coin); 
    }
]);
