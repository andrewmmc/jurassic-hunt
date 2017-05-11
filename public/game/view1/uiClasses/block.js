uiClasses.factory("Block", [
    'loaderSvc', 'Platform',
    function(loaderSvc, Platform) {
        "use strict";

        function Block(obj) {
            this.block = new createjs.Bitmap(loaderSvc.getResult(obj.assetName));
            this.block.name = "Block";
            this.block.snapToPixel = true;
            this.block.hittedBlock = false;
            this.block.hurt = false;
            this.placeLast(obj.JMP, obj.randomNumber);
        }

        Block.lastBlock = null; // Reference to all Blocks

        Block.prototype = {
            returnBlock: function() {
                return this.block;
            },
            hittedBlock: function() {
                this.block.hittedBlock = false;
            },
            hurt: function() {
                this.block.hurt = true;
            },
            getImageWidth: function() {
                return this.block.image.width;
            },
            getImageHeight: function() {
                return this.block.image.height;
            },
            setX: function(val) {
                this.block.x = val;
            },
            setY: function(val) {
                this.block.y = val;
            },
            placeLast: function(val, randomNumber) {
                var lastp = Block.lastBlock,
                    w = 250;
                if (randomNumber < 0.15) {
                    this.block.visible = true;
                } else {
                    this.block.visible = false;
                }
                this.block.hurt = false;
                lastp = lastp || {
                    x: (-w * 1.7) + 100,
                    y: (val * 0.65) - 65
                };
                this.block.x = Platform.lastPlatform.x + Math.floor((randomNumber * 150) + 50);
                this.block.y = Platform.lastPlatform.y - 65;
                Block.lastBlock = this.block;
            },
            onTick: function(val, randomNumber) {
                // get the global position
                var gp = this.block.localToGlobal(0, 0);
                // check against the width + 5px buffer
                if (gp.x < -this.block.image.width - 250 /* Width of platform */ ) {
                    this.placeLast(val, randomNumber);
                }
            }
        };
        return (Block); 
    }
]);
