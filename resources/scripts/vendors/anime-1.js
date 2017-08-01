(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
  width: 250,
  height: 250,
  fps: 18,
  color: "#FFFFFF",
  opacity: 1.00,
  manifest: []
};



lib.ssMetadata = [];


// symbols:



(lib.outerring = function(mode,startPosition,loop) {
  this.initialize(mode,startPosition,loop,{});

  // Layer 1
  this.shape = new cjs.Shape();
  this.shape.graphics.lf(["#A4DF18","#67C500"],[0,1],-56.8,0,56.9,0).s().p("AgZJmQg7gQgfg1QgPgbgDgfQgDgdAIgdIixheQgRAVgYAOQg1Aeg6gQQg8gPgeg1Qgfg1AQg7QAQg8A1geQAXgNAbgEIAHjIQgdgGgYgSQgZgSgQgbQgeg1AQg7QAQg6A1gfQAtgaA2AJQA0AKAiAnICNhRQgRgyASgyQASgyAugbQA1geA5APQA6APAfA1QAPAbAEAfQADAdgIAdICxBeQARgVAYgNQA1gfA7ARQA7APAeA1QAfA1gQA7QgQA7g1AfQgXANgbAEIgHDHIAAAAQAdAHAZASQAYASAQAbQAeA1gPA8QgQA7g0AfQgvAagzgIQg0gIgignIiNBRQARAxgTAxQgTAxguAbQgiATglAAQgSAAgWgGgAggGJQggATgKAkQgKAkATAgQATAhAkAKQAiAJAhgSQAggTAJgkQAKgkgTghQgSgggkgKQgNgDgMAAQgVAAgVAMgAkRDiQADAegIAdICxBeQAQgTAagPQAtgaA0AKQA0AJAiAnICNhRQgRgyASgxIADgHIiphsIAggzICqBtQAMgMAQgJQAcgQAWgDIAHjHQgegHgYgRQgZgSgPgbQgQgbgDgfQgEgeAKgdIiyhdQgSAWgWANQgSAKgSAFIAADGIg6AAIAAjDIgCAAQg0gJgignIiNBRQARAygTAxQgTAxguAbQgUALgfAFIgHDHQAdAHAZASQANAJALANICxhyIAgAzIizBzIgCgEQAFAQACARgAFmCnQghATgJAkQgKAkASAgQATAhAkAKQAlAJAggSQAhgTAJgkQAKgkgTghQgTgggkgKQgMgDgMAAQgXAAgVAMgAnRCkQggASgKAkQgJAkASAhQATAgAkAKQAkAKAggTQASgKAMgRQALgRAEgTQAFgggQgcQgTghgkgKQgMgDgMAAQgXAAgWANgAF3lAQggASgKAkQgJAkASAhQATAgAkAKQAkAKAggTQAhgSAKglQAJgkgSggQgTghgkgKQgMgDgMAAQgXAAgWANgAm/lFQghATgKAkQgJAkASAhQARAcAeALQATAHAUgBQAUgCASgKQAggTAKgkQAJgkgSggQgTghgkgKQgNgDgLAAQgXAAgVAMgAg4onQggATgKAkQgKAkATAhQASAgAlAKQAiAJAhgSQAggTAJgkQAKgkgTggQgSghglgKQgKgDgMAAQgWAAgWAMg");
  this.shape.setTransform(0.5,0);

  this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-56.3,-62,113.8,124.1);


(lib.innerring = function(mode,startPosition,loop) {
  this.initialize(mode,startPosition,loop,{});

  // Layer 1
  this.shape = new cjs.Shape();
  this.shape.graphics.f().ls(["#A4DF18","#67C500"],[0,1],-14.7,0,14.8,0).ss(6,1,1).p("AB1AAQAAAwgiAjQgjAigwAAQgvAAgjgiQgigjAAgwQAAgvAigjQAjgiAvAAQAwAAAjAiQAiAjAAAvg");

  this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-14.7,-14.7,29.5,29.5);


// stage content:
(lib._1 = function(mode,startPosition,loop) {
  this.initialize(mode,startPosition,loop,{});

  // Inner Ring
  this.instance = new lib.innerring();
  this.instance.parent = this;
  this.instance.setTransform(125,125,0.021,0.021);

  this.timeline.addTween(cjs.Tween.get(this.instance).to({scaleX:1,scaleY:1},7,cjs.Ease.get(1)).wait(21).to({scaleX:0.8,scaleY:0.8},5,cjs.Ease.get(1)).wait(7).to({regX:0.1,regY:0.1,scaleX:1,scaleY:1},6,cjs.Ease.get(0.92)).wait(35).to({regX:11.4,regY:0,scaleX:0,scaleY:0,x:124.5},5,cjs.Ease.get(1)).wait(3));

  // Layer 1 (mask)
  var mask = new cjs.Shape();
  mask._off = true;
  var mask_graphics_0 = new cjs.Graphics().p("AoOIPQjajaAAk1QAAk0DajaQDajaE0AAQE1AADaDaQDaDaAAE0QAAE1jaDaQjaDak1AAQk0AAjajagAhAhkQgcAcABAnQgBAmAcAbQAcAcAlAAQAoAAAcgcQAcgbAAgmQAAgngcgcQgcgcgoAAQglAAgcAcg");
  var mask_graphics_88 = new cjs.Graphics().p("AoOIPQjajaAAk1QAAk0DajaQDajaE0AAQE1AADaDaQDaDaAAE0QAAE1jaDaQjaDak1AAQk0AAjajagAhAhkQgcAcABAnQgBAmAcAbQAcAcAlAAQAoAAAcgcQAcgbAAgmQAAgngcgcQgcgcgoAAQglAAgcAcg");

  this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:124.3,y:128.5}).wait(88).to({graphics:mask_graphics_88,x:124.3,y:128.5}).wait(1));

  // Outer
  this.instance_1 = new lib.outerring();
  this.instance_1.parent = this;
  this.instance_1.setTransform(124.5,125,0.004,0.004,0,0,0,11.4,0);

  this.instance_1.mask = mask;

  this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(7).to({x:130.7,y:122.7},0).to({regY:0.1,scaleX:1,scaleY:1,rotation:90,x:124.9,y:135.9},11,cjs.Ease.get(1)).wait(5).to({regX:11.5,regY:-0.1,scaleX:0.8,scaleY:0.8,rotation:119.9,x:120.5,y:133},5,cjs.Ease.get(0.87)).wait(18).to({regY:-0.3,scaleX:1,scaleY:1,rotation:180,x:113.5,y:125.3},10,cjs.Ease.get(0.93)).wait(11).to({regX:-0.8,regY:-4.7,scaleX:0.01,scaleY:0.01,rotation:0,skewX:99,skewY:99,x:131.8,y:125},15,cjs.Ease.get(0.97)).to({_off:true},1).wait(6));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(249.2,249.7,1.1,0.6);

})(lib_ico1 = lib_ico1||{}, images_ico1 = images_ico1||{}, createjs = createjs||{}, ss_ico1 = ss_ico1||{});
var lib_ico1, images_ico1, createjs, ss_ico1;
