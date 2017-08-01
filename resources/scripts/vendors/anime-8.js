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



(lib.tick = function(mode,startPosition,loop) {
  this.initialize(mode,startPosition,loop,{});

  // Layer 1
  this.shape = new cjs.Shape();
  this.shape.graphics.f().s("#7FC13A").ss(4,1).p("Ah4AFIBLBKICmil");
  this.shape.setTransform(0,0.4);

  this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-14.1,-10.3,28.3,21.5);


(lib.spin2 = function(mode,startPosition,loop) {
  this.initialize(mode,startPosition,loop,{});

  // Layer 1
  this.shape = new cjs.Shape();
  this.shape.graphics.f("#7FC13A").s().p("AiFGeQgrgOgWgpQgNgXgUgPQgWgQgagFQgtgIgbglQgbglAGgtQAFgagJgZQgIgZgSgTQghghAAgtQAAgtAhggQASgTAIgZQAJgZgFgaQgGguAbglQAbglAtgIQAagEAWgQQAUgPANgXQAWgpArgOQArgOAqAUQAXALAZAAQAaAAAXgLQAqgUAsAOQArAOAWApQAMAXAVAPQAVAQAaAEQAtAIAbAlQAbAlgHAuQgDAaAIAZQAIAZATATQAfAgAAAtQAAAtgfAhQgTATgIAZQgIAZADAaQAHAtgbAlQgbAlgtAIQgaAFgVAQQgVAPgMAXQgXApgqAOQgtAOgpgUQgXgMgaAAQgZAAgXAMQgYAMgZAAQgSAAgSgGgAi+i+QhPBPAABvQAABvBPBQQBPBPBvAAQBwAABPhPQBPhQAAhvQAAhvhPhPQhPhPhwAAQhvAAhPBPg");

  this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-43.6,-42,87.2,84.1);


// stage content:
(lib._8 = function(mode,startPosition,loop) {
  this.initialize(mode,startPosition,loop,{});

  // Layer 44 (mask)
  var mask = new cjs.Shape();
  mask._off = true;
  mask.graphics.p("Ah+DpQgggSgdgcQhNhOAAhtQAAhsBNhPQBPhNBsAAQA6AAAyAWQArATAkAkQBOBPAABsQAABthOBOQhOBOhtAAQhFAAg5ggg");
  mask.setTransform(125,125);

  // Layer 1 copy
  this.instance = new lib.tick();
  this.instance.parent = this;
  this.instance.setTransform(125,185.4,1,1,0,0,0,0,0.4);
  this.instance._off = true;

  this.instance.mask = mask;

  this.timeline.addTween(cjs.Tween.get(this.instance).wait(26).to({_off:false},0).to({y:125.4},9,cjs.Ease.get(0.98)).wait(5).to({y:65.4},8).wait(1));

  // Layer 1
  this.instance_1 = new lib.tick();
  this.instance_1.parent = this;
  this.instance_1.setTransform(125,185.4,1,1,0,0,0,0,0.4);

  this.instance_1.mask = mask;

  this.timeline.addTween(cjs.Tween.get(this.instance_1).to({y:125.4},9,cjs.Ease.get(0.98)).wait(5).to({y:65.4},8).to({_off:true},1).wait(26));

  // Layer 1
  this.instance_2 = new lib.spin2();
  this.instance_2.parent = this;
  this.instance_2.setTransform(125,125);

  this.timeline.addTween(cjs.Tween.get(this.instance_2).to({regX:0.1,regY:0.1,rotation:180},48).wait(1));

  // Layer 1
  this.shape = new cjs.Shape();
  this.shape.graphics.lf(["#67C500","#A1DD17"],[0,1],-65.5,0,65.5,0).s().p("AnOHOQjAjAAAkOQAAkODAjAQDAjAEOAAQEOAADADAQDBDAAAEOQAAEOjBDAQjADBkOAAQkOAAjAjBgAmHmHQiiCjgBDkQABDmCiCiQCjCjDkAAQDmAACiijQCjiiAAjmQAAjkijijQiiiijmgBQjkABijCig");
  this.shape.setTransform(125,125);

  this.timeline.addTween(cjs.Tween.get(this.shape).wait(49));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(184.5,184.5,131,131);

})(lib_ico8 = lib_ico8||{}, images_ico8 = images_ico8||{}, createjs = createjs||{}, ss_ico8 = ss_ico8||{});
var lib_ico8, images_ico8, createjs, ss_ico8;
