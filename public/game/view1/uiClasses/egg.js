uiClasses.factory("Egg", [
    'loaderSvc', 'Platform',
    function(loaderSvc, Platform) {
        "use strict";

        function Egg(obj) {
            this.egg = new createjs.Bitmap(loaderSvc.getResult(obj.assetName));
            this.egg.name = "Egg";
            this.egg.snapToPixel = true;
            this.egg.addedEgg = false;
            this.placeLast(obj.JMP, obj.randomNumber);
        }

        Egg.lastEgg = null; // Reference to all Egg

        Egg.prototype = {
            returnEgg: function() {
                return this.egg;
            },
            addedEgg: function() {
                this.egg.addedEgg = false;
            },
            getImageWidth: function() {
                return this.egg.image.width;
            },
            getImageHeight: function() {
                return this.egg.image.height;
            },
            setX: function(val) {
                this.egg.x = val;
            },
            setY: function(val) { //距離 Ground 的高度, 正數表示
                this.egg.y = val;
            },
            placeLast: function(val, randomNumber) {
                this.egg.addedEgg = false;
                // Generate Coin here.
                // retrieve the last Coin
                var lastp = Egg.lastEgg,
                    w = 250;
                // Make the coin visable again & not yet added (if player ate the egg)
                if (Math.random() > 0.8) {
                    this.egg.visible = true;
                } else {
                    this.egg.visible = false;
                }
                this.egg.addedEgg = false;
                // or set it do a default, in case there are none
                lastp = lastp || {
                    x: (-w * 1.7) + 100,
                    y: (val * 0.65) - 80
                };
                // place the Coin relative to the last one
                this.egg.x = Platform.lastPlatform.x + Math.floor((randomNumber * 200) + 20);
                this.egg.y = Platform.lastPlatform.y - 70;
                // save it in the global Coin-store
                //console.log(this.egg.x, this.egg.y);
                Egg.lastEgg = this.egg;
            },
            onTick: function(val, randomNumber) {
                // get the global position
                var gp = this.egg.localToGlobal(0, 0);
                // check against the width + 5px buffer
                if (gp.x < -this.egg.image.width - 250 /* Width of platform */ ) {
                    this.placeLast(val, randomNumber);
                }
            }
        };
        return (Egg); 
    }
]);
