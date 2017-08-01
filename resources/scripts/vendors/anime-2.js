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



(lib._01 = function(mode,startPosition,loop) {
  this.initialize(mode,startPosition,loop,{});

  // Layer 1
  this.shape = new cjs.Shape();
  this.shape.graphics.lf(["#A1DD17","#67C500"],[0,1],-15,-14.9,14.9,15).s().p("ABcCxIkMkMQgOgOAOgOIA4g5QAPgOAOAOIEMEMQAOAOgOAPIg5A4QgHAHgHAAQgHAAgHgHg");
  this.shape.setTransform(0,0,1.2,1.2);

  this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-22.1,-22.1,44.3,44.3);


// stage content:
(lib._2 = function(mode,startPosition,loop) {
  this.initialize(mode,startPosition,loop,{});

  // Layer 6
  this.instance = new lib._01();
  this.instance.parent = this;
  this.instance.setTransform(148.2,153.1,1,1,-90);

  this.timeline.addTween(cjs.Tween.get(this.instance).wait(21).to({x:153.2,y:158.1},8,cjs.Ease.get(1)).wait(7).to({x:148.2,y:153.1},4,cjs.Ease.get(0.99)).wait(5));

  // Layer 5
  this.instance_1 = new lib._01();
  this.instance_1.parent = this;
  this.instance_1.setTransform(97.4,151.3);

  this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(10).to({x:92.4,y:156.3},5,cjs.Ease.get(1)).wait(10).to({x:97.4,y:151.3},5,cjs.Ease.get(1)).wait(15));

  // Layer 4
  this.instance_2 = new lib._01();
  this.instance_2.parent = this;
  this.instance_2.setTransform(96.9,100.6,1,1,-90);

  this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(21).to({x:91.4,y:95.1},10,cjs.Ease.get(1)).wait(8).to({x:96.9,y:100.6},4,cjs.Ease.get(1)).wait(2));

  // Layer 3
  this.instance_3 = new lib._01();
  this.instance_3.parent = this;
  this.instance_3.setTransform(149.2,99.5);

  this.timeline.addTween(cjs.Tween.get(this.instance_3).to({x:154.2,y:94.5},6,cjs.Ease.get(1)).wait(9).to({x:149.2,y:99.5},4,cjs.Ease.get(1)).wait(26));

  // Layer 1
  this.shape = new cjs.Shape();
  this.shape.graphics.lf(["#A1DD17","#67C500"],[0,1],-37,1,35,1).s().p("AldAeIAhggIgcgcIE0k0IAdAcIAlgmIE/E/IgmAlIAeAfIk0E0IgegeIgfAgg");
  this.shape.setTransform(123.5,125.5);

  this.timeline.addTween(cjs.Tween.get(this.shape).wait(45));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(199.8,202.4,96.6,97.9);

})(lib_ico2 = lib_ico2||{}, images_ico2 = images_ico2||{}, createjs = createjs||{}, ss_ico2 = ss_ico2||{});
var lib_ico2, images_ico2, createjs_ico2, ss_ico2;
