/*
  The MIT License

  Copyright (c) 2013 Olaf Horstmann, indiegamr.com

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

/**
* A set of utility methods
* @author Olaf Horstmann, indiegamr.com
**/

this.ndgmr = this.ndgmr || {};

(function(scope) {

  Math.seed = 0;
  Math.seededRandom = function(max,min) {
    max = max || 1;
    min = min || 0;

    Math.seed = (Math.seed*9301+49297) % 233280;
    var rnd = Math.seed / 233280.0;

    return min + rnd * (max-min);
  }

  function nativeScale(img, scale)
  {
    var dst_canvas = document.createElement('canvas');
    dst_canvas.width = Math.max(1,img.width * scale);
    dst_canvas.height = Math.max(1,img.height * scale);
    var dst_ctx = dst_canvas.getContext('2d');

    var offset = 0;
    //dst_ctx.scale(scale,scale);
    dst_ctx.drawImage(img,0,0,dst_canvas.width,dst_canvas.height);

    return ndgmr.canvasToImage(dst_canvas) || dst_canvas;
  }
  ndgmr.nativeScale = nativeScale;

  function nearestNeighborScale(img, scale)
  {
    // to have a good looking scaling
    // we will snap all values to 0.5-steps
    // so 1.4 e.g. becomes 1.5 - you can also
    // set the snapping to 1.0 e.g.
    // however I would recommend to use only 
    // a multiple of 0.5 - but play around
    // with it and see the results
    scale = snapValue(scale,.5);
    if ( scale <= 0 ) scale = 0.5;

    // the size of the "pixels" in the new images
    // will be rounden to integer values, as drawing
    // a rect with 1.5x1.5 would result in half-transparent
    // areas
    var pixelSize = (scale+0.99) | 0;

    // getting the data-array containing all the pixel-data
    // from our source-image
    var src_canvas = document.createElement('canvas');
    src_canvas.width = img.width;
    src_canvas.height = img.height;
    var src_ctx = src_canvas.getContext('2d');
    src_ctx.drawImage(img, 0, 0);
    var src_data = src_ctx.getImageData(0, 0, img.width, img.height).data;
    
    // setting up the new, scaled image
    var dst_canvas = document.createElement('canvas');
    // just to be sure, that no pixel gets lost, when
    // we scale the image down, we add 1 and floor the
    // result
    dst_canvas.width = (img.width * scale+1) | 0;
    dst_canvas.height = (img.height * scale+1) | 0;
    var dst_ctx = dst_canvas.getContext('2d');

    // reading each pixel-data from the source
    // and drawing a scaled version of that pixel
    // to the new canvas
    var offset = 0;
    for (var y = 0; y < img.height; ++y) {
        for (var x = 0; x < img.width; ++x) {
            var r = src_data[offset++];
            var g = src_data[offset++];
            var b = src_data[offset++];
            var a = src_data[offset++] / 255;
            dst_ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
            dst_ctx.fillRect(x * scale, y * scale, pixelSize, pixelSize);
        }
    }
    
    return (!navigator.isCocoonJS && ndgmr.canvasToImage(dst_canvas)) || dst_canvas;
  }
  ndgmr.nearestNeighborScale = nearestNeighborScale;

  function canvasToImage(canvas) {
    if ( !canvas.toDataURL ) return null;

    var img = new Image();
    img.width = canvas.width;
    img.height = canvas.height;
    img.src = canvas.toDataURL("image/png");

    return img;
  }
  ndgmr.canvasToImage = canvasToImage;

  function snapValue(value,snap)
  {
    var roundedSnap = (value/snap + (value > 0 ? .5 : -.5)) | 0;
    return roundedSnap * snap;
  }
  ndgmr.snapValue = snapValue;

  function getScreenWidth() {
    if( typeof( window.innerWidth ) == 'number' ) {
      return window.innerWidth;
    } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
      return document.documentElement.clientWidth;
    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
      return document.body.clientWidth;
    }
  }
  ndgmr.getScreenWidth = getScreenWidth;

  function getScreenHeight() {
    if( typeof( window.innerWidth ) == 'number' ) {
      return window.innerHeight;
    } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
      return document.documentElement.clientHeight;
    } else if( document.body && ( document.body.clientHeight || document.body.clientHeight ) ) {
      return document.body.clientHeight;
    }
  }
  ndgmr.getScreenHeight = getScreenHeight;
}(this));