uiClasses.factory("Tree", [
    'loaderSvc',
    function(loaderSvc) {
        "use strict";

        function Tree(obj) {
            this.tree = new createjs.Bitmap(loaderSvc.getResult(obj.assetName));
            this.tree.setTransform(obj.x, obj.y);
        }
        Tree.prototype = {
            addToStage: function(stage) {
                stage.addChild(this.tree);
            },
            removeFromStage: function(stage) {
                stage.removeChild(this.tree);
            },
            getImageWidth: function() {
                return this.tree.image.width;
            },
            getScaleX: function() {
                return this.tree.scaleX;
            },
            getX: function() {
                return this.tree.x;
            },
            getY: function() {
                return this.tree.y;
            },
            setX: function(val) {
                this.tree.x = val;
            },

            setY: function(val) {
                this.tree.y = val;
            },
            move: function(x, y) {
                this.tree.x = this.tree.x + x;
                this.tree.y = this.tree.y + y; 
            }
        };
        return (Tree);
    }
]);
