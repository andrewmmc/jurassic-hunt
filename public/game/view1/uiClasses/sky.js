uiClasses.factory("Sky", [
    'loaderSvc',
    function(loaderSvc) {
        "use strict";

        function Sky(obj) {
            //this.sky = new createjs.Shape();
            //this.sky.graphics.beginBitmapFill(loaderSvc.getResult("sky")).drawRect(0, 0, obj.width, obj.height);
            //this.sky.graphics.beginFill("#32C7EA").drawRect(0, 0, obj.width, obj.height);
            this.sky = new createjs.Bitmap(loaderSvc.getResult("sky"));
            this.sky.scaleX = obj.JMPCW / obj.JMPS;
            this.sky.scaleY = obj.JMPCH / 400 /*this.sky.image.height*/ ;
        }

        Sky.prototype = {
            addToStage: function(stage) {
                stage.addChild(this.sky);
            },
            removeFromStage: function(stage) {
                stage.removeChild(this.sky);
            }
        };

        return (Sky);
    }
]);
