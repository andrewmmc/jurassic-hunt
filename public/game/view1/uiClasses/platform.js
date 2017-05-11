uiClasses.factory("Platform", [
    'loaderSvc',
    function(loaderSvc) {
        "use strict";

        function Platform(obj) {
            this.platform = new createjs.Bitmap(loaderSvc.getResult(obj.assetName));
            //this.platform.setTransform(0, obj.height - this.platform.image.height /* - obj.groundHeight*/ );
            this.platform.name = "Platform";
            this.platform.snapToPixel = true;
            this.placeLast(obj.JMP, obj.randomNumber);
        }

        Platform.lastPlatform = null; // Reference to all platforms
        //Platform.thisPlatform.x = Platform.thisPlatform.y = null;

        Platform.prototype = {
            returnPlatform: function() {
                return this.platform;
            },
            getImageWidth: function() {
                return this.platform.image.width;
            },
            getImageHeight: function() {
                return this.platform.image.height;
            },
            /*getX: function() {
                return this.platform.x;
            },
            getY: function() {
                return this.platform.y;
            },*/
            setX: function(val) {
                this.platform.x = val;
            },
            setY: function(val) { //距離 Ground 的高度, 正數表示
                this.platform.y = val;
            },
            placeLast: function(val, randomNumber) {
                // Generate platform here.
                // retrieve the last platform
                var lastp = Platform.lastPlatform,
                    w = this.getImageWidth();
                // or set it do a default, in case there are none
                lastp = lastp || {
                    x: -w * 1.7,
                    y: val * 0.65
                };
                // place the platform relative to the last one
                this.platform.x = lastp.x + w * (randomNumber * 0.7 + 1.5);
                this.platform.y = lastp.y + val * randomNumber * 0.3 - val * 0.15;
                // save it in the global platform-store
                //console.log(this.platform.x, this.platform.y);
                Platform.lastPlatform = this.platform;
                //console.log(Platform.lastPlatform);
            },
            onTick: function(val, randomNumber) {
                // get the global position
                var gp = this.platform.localToGlobal(0, 0);
                // check against the width + 5px buffer
                if (gp.x < -this.platform.image.width - 5) {
                    this.placeLast(val, randomNumber);
                }
            }
        };
        return (Platform); 
    }
]);
