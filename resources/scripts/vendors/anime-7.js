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



(lib.spin = function(mode,startPosition,loop) {
  this.initialize(mode,startPosition,loop,{});

  // Layer 1
  this.shape = new cjs.Shape();
  this.shape.graphics.f("#7FC13A").s().p("AgXHEQgfgCgegFQgEAAgCgEQgCgDAAgEQABgEAEgDQADgCAEABQAcAFAeABQAEAAADADQADADAAAEQAAAFgDACQgDADgEAAIgBAAgAAfHAQgDgCgBgEQAAgEADgEQACgDAFAAQAdgCAcgGQAFgBADACQAEACABAEQAAAEgCAEQgCADgEABQgeAHgfACIgBAAQgDAAgDgDgAiOGuQgegJgbgOQgEgCgBgEQgCgEACgEQACgDAEgCQAEgBAEACQAaANAcAJQAEACACADQACAEgCAEQgBAEgEACIgEABIgDgBgACWGpQgEgBgBgEQgCgEACgEQABgDAEgCQAcgKAZgOQAEgCAEABQAEABACAEQACADgBAEQgBAEgEACQgbAPgdALIgDAAIgEgBgAj8F3QgZgRgWgUQgDgDAAgEQAAgEACgDQADgDAEgBQAEAAAEADQAVAUAYAQQADACAAAEQABAEgCAEQgCADgFABIgCAAQgCAAgDgCgAEBFxQgEgBgCgDQgDgDABgFQAAgEAEgCQAXgRAVgVQADgDAFAAQAEABACACQADAEAAAEQAAAEgDADQgWAVgYASQgDACgDAAIgCAAgAlSEmQgEAAgDgDQgUgXgQgaQgCgDABgEQAAgEAEgCQADgDAEABQAEABADADQAPAYAUAXQACADAAAEQgBAEgDADQgDADgDAAIgBgBgAFUEbQgDgCgBgFQAAgEACgDQATgXAPgYQACgEAFgBQAEgBADACQAEADAAAEQABAEgCADQgQAagTAYQgDADgEAAIgBABQgDAAgDgDgAmVDCQgEgBgCgEQgNgcgJgeQgBgEACgDQACgEAEgBQAEgBAEACQADACABAEQAJAcAMAbQACADgBAEQgCAEgEACIgEABIgDgBgAGUC4QgEgCgBgEQgCgEACgEQALgaAIgdQABgEAEgCQADgCAFABQADABACAEQADAEgCAEQgIAdgMAcQgCAEgDACIgEABIgEgBgAm6BOQgEgCAAgFQgEgdgBgeQAAgEADgDQACgDAFgBQAEAAACADQAEADAAAEQABAeAEAbQAAAFgCADQgDADgEABIgBAAQgDAAgDgCgAG1BFQgEAAgCgEQgDgDABgEQADgdAAgdIAAAAIAAgXQAAgEADgDQACgDAEAAQAEAAAEADQADACAAAEIAAAYIAAAAQAAAfgDAdQgBAEgDADQgDACgDAAIgCAAgAm4goQgEAAgCgEQgDgDAAgEQADgfAIgdQAAgEAEgCQAEgCAEABQAEABACADQACAEgBAEQgHAcgDAdQAAAEgDADQgDACgEAAIgBAAgAGthLQgDgCgBgEQgFgegKgcQgCgEACgDQACgEAEgCQAEgBAEACQADACACAEQAKAdAFAfQABAEgCAEQgCADgFABIgCAAQgCAAgDgCgAmdicQgEgBgCgEQgCgEACgEQAMgcAPgbQACgDAEgBQAEgBAEACQADACACAEQABAEgCADQgPAagLAbQgCAEgEABIgEABIgDgBgAGJi8QgEgBgCgEQgNgZgRgZQgCgDAAgEQABgEAEgDQADgCAEABQAEAAACAEQASAZAOAbQACAEgBAEQgCAEgDACIgFABIgDgBgAljkFQgEgCAAgEQgBgEADgEQASgWAVgVIABgBQADgDAEAAQAEAAADADQADADAAAEQAAAEgDADIgBABQgUAUgRAWQgDADgEAAIgBABQgEAAgCgDgAFHkdQgEAAgDgDIgPgQIgYgXQgDgCAAgEQAAgEACgEQADgDAEAAQAEAAADACIAZAYIAQAQQADADAAAEQAAAEgDADQgDADgEAAIgBAAgAkLlWQgEAAgDgEQgCgDAAgEQABgEADgDQAZgSAagPQADgCAFABQADABADADQACAEgBAEQgCAEgDACQgZAOgYASQgCADgEAAIgBgBgADplrQgZgRgagMQgEgCgCgEQgBgDACgEQABgEAEgBQAEgCAEACQAcANAaARQAEACAAAEQABAFgCADQgCADgEABIgCAAQgDAAgDgBgAimmRQgEgCgBgEQgCgEACgEQABgDAEgCQAdgLAegHQAEgBAEACQADACABAEQABAEgCAEQgCADgFABQgcAHgbALIgEABIgEgBgAB/meQgcgIgdgEQgEgBgDgDQgCgDAAgFQABgEADgCQAEgDAEABQAeAFAeAIQADACACADQACAEgBAEQgBAEgDACIgFABIgDgBgAgzmvQgDgDAAgEQgBgEADgEQADgDAEAAQAXgCAWAAIAMAAQAEAAADADQADADAAAEQAAAEgDADQgDADgEAAIgMAAQgVAAgWACIgBAAQgEAAgDgCg");

  this.shape_1 = new cjs.Shape();
  this.shape_1.graphics.lf(["#67C500","#A1DD17"],[0,1],-19.3,0,19.3,0).s().p("AAADAIgFAAIgMAAQhEgGgygyQg5g5ABhPQgBhOA5g5QAygyBEgGIAMgBIAEAAIABAAIAFAAQBMACA3A3QA5A5AABOQAABPg5A5Qg3A2hMACIgFAAg");
  this.shape_1.setTransform(0.7,0.5);

  this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-45.2,-45.2,90.6,90.5);


(lib.ret1 = function(mode,startPosition,loop) {
  this.initialize(mode,startPosition,loop,{});

  // Layer 1
  this.shape = new cjs.Shape();
  this.shape.graphics.lf(["#67C500","#A1DD17"],[0,1],-9.2,0,9.3,0).s().p("AhbJxIAAzhIC3AAIAAThg");

  this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-9.2,-62.5,18.5,125.1);


(lib.pulsingcircle = function(mode,startPosition,loop) {
  this.initialize(mode,startPosition,loop,{});

  // Layer 1
  this.instance = new lib.spin();
  this.instance.parent = this;

  this.timeline.addTween(cjs.Tween.get(this.instance).to({rotation:-70},19,cjs.Ease.get(0.94)).to({rotation:0},20,cjs.Ease.get(1)).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-45.2,-45.2,90.6,90.6);


// stage content:



(lib._7 = function(mode,startPosition,loop) {
  this.initialize(mode,startPosition,loop,{});

  // Layer 32
  this.instance = new lib.ret1();
  this.instance.parent = this;
  this.instance.setTransform(124.3,190.8,1,0.14,0,0,0,0,62.9);

  this.timeline.addTween(cjs.Tween.get(this.instance).wait(9).to({regX:0.1,regY:63.1,scaleY:0.25,x:124.4,y:191.1},9,cjs.Ease.get(0.93)).wait(6).to({scaleY:0.19},5,cjs.Ease.get(0.96)).wait(7).to({regY:63.2,scaleY:0.31},6,cjs.Ease.get(0.94)).wait(7).to({scaleY:0.14},5,cjs.Ease.get(1)).wait(6));

  // Layer 31
  this.instance_1 = new lib.ret1();
  this.instance_1.parent = this;
  this.instance_1.setTransform(167.3,190.8,1,0.496,0,0,0,0,62.6);

  this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(14).to({scaleY:0.82,y:190.9},8,cjs.Ease.get(1)).wait(4).to({scaleY:0.49},7,cjs.Ease.get(0.96)).wait(6).to({regX:0.1,regY:62.7,scaleY:0.87,x:167.4},8,cjs.Ease.get(0.98)).wait(8).to({regY:62.8,scaleY:0.5},4,cjs.Ease.get(0.96)).wait(1));

  // Layer 30
  this.instance_2 = new lib.ret1();
  this.instance_2.parent = this;
  this.instance_2.setTransform(82.8,191,1,1,0,0,0,0,62.5);

  this.timeline.addTween(cjs.Tween.get(this.instance_2).to({regY:62.6,scaleY:0.5,y:191.1},7,cjs.Ease.get(0.99)).wait(22).to({regY:62.7,scaleY:0.72},7,cjs.Ease.get(0.99)).wait(10).to({regY:62.8,scaleY:1,y:191.2},6,cjs.Ease.get(0.98)).wait(8));

  // expanding circle
  this.instance_3 = new lib.pulsingcircle();
  this.instance_3.parent = this;
  this.instance_3.setTransform(123.5,105.5);

  this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(5).to({scaleX:0.7,scaleY:0.7},6,cjs.Ease.get(1)).wait(7).to({regX:0.1,regY:0.1,scaleX:1.1,scaleY:1.1},9,cjs.Ease.get(1)).wait(7).to({scaleX:0.8,scaleY:0.8},6,cjs.Ease.get(1)).wait(8).to({scaleX:1,scaleY:1},9,cjs.Ease.get(1)).wait(3));

  // Layer 29
  this.shape = new cjs.Shape();
  this.shape.graphics.f().s("#7FC13A").p("AAAlQIAAKh");
  this.shape.setTransform(124.1,150.8);

  this.timeline.addTween(cjs.Tween.get(this.shape).wait(60));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(198.6,185.3,103,130.8);

})(lib_ico7 = lib_ico7||{}, images_ico7 = images_ico7||{}, createjs = createjs||{}, ss_ico7 = ss_ico7||{});
var lib_ico7, images_ico7, createjs, ss_ico7;
