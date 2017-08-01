(function($) {
  $(document).ready(function()
  {
    var canvas, stage, exportRoot;
function init() {

}
function handleComplete() {
  //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
  exportRoot = new lib_ico8._8();
  stage = new createjs.Stage(canvas);
  stage.addChild(exportRoot);
  //Registers the "tick" event listener.
  createjs.Ticker.setFPS(lib_ico8.properties.fps);
  createjs.Ticker.addEventListener("tick", stage);
  //Code to support hidpi screens and responsive scaling.
  (function(isResp, respDim, isScale, scaleType) {
    var lastW, lastH, lastS=1;
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    function resizeCanvas() {
      var w = lib_ico8.properties.width, h = lib_ico8.properties.height;
      var iw = window.innerWidth, ih=window.innerHeight;
      var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;
      if(isResp) {
        if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {
          sRatio = lastS;
        }
        else if(!isScale) {
          if(iw<w || ih<h)
            sRatio = Math.min(xRatio, yRatio);
        }
        else if(scaleType==1) {
          sRatio = Math.min(xRatio, yRatio);
        }
        else if(scaleType==2) {
          sRatio = Math.max(xRatio, yRatio);
        }
      }
      canvas.width = w*pRatio*sRatio;
      canvas.height = h*pRatio*sRatio;
      canvas.style.width = w*sRatio+'px';
      canvas.style.height = h*sRatio+'px';
      stage.scaleX = pRatio*sRatio;
      stage.scaleY = pRatio*sRatio;
      lastW = iw; lastH = ih; lastS = sRatio;
    }
  })(false,'both',false,1);
}



    if ( $( '#ico8' ).length > 0 )
    {
      canvas = document.getElementById("ico8");
      handleComplete();
    }

  });
})(jQuery);
