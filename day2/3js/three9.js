// Create a renderer
var renderer = new THREE.WebGLRenderer({antialias: true});
var width = document.body.clientWidth;
var height = document.body.clientHeight;
renderer.setSize(width, height);

// Plug it into the document
document.body.appendChild(renderer.domElement);

// Make it pretty!
renderer.setClearColor(0xEEEEEE, 1.0);

// Shadows ON!
renderer.shadowMapEnabled = true;
renderer.shadowMapWidth = renderer.shadowMapHeight = 1024;
renderer.shadowMapFov = 30;

// Create a camera
// new THREE.PerspectiveCamera( FOV, viewAspectRatio, zNear, zFar );
var camera = new THREE.PerspectiveCamera(45, width/height, 1, 10000);
camera.position.y = 30;

// Make a scene
var scene = new THREE.Scene();

// Add some fog.  Cool!
// Note the separate scene for this.  We can have multiple scenes with their own
// settings and render each one in turn.
var coordScene = new THREE.Scene();
coordScene.fog = new THREE.FogExp2(0xEEEEEE, 0.0035);

// Add coordinate axes
function v(x,y,z){ 
  return new THREE.Vector3(x,y,z);
}

var lineGeo = new THREE.Geometry();
lineGeo.vertices.push(
  v(-500, 0, 0), v(500, 0, 0),
  v(0, -500, 0), v(0, 500, 0),
  v(0, 0, -500), v(0, 0, 500)
);
var lineMat = new THREE.LineBasicMaterial({
  color: 0x000000, lineWidth: 1});
var line = new THREE.Line(lineGeo, lineMat);
line.type = THREE.Lines;
coordScene.add(line);

// Add scene lighting - two point lighting now.
var light = new THREE.SpotLight(0xFFFFFF);
light.position.set(150, 200, 300);
light.castShadow = true;
scene.add(light);

var backlight = new THREE.PointLight(0x333366);
backlight.position.set(-150, -200, -300);
scene.add(backlight);

var ambient = new THREE.AmbientLight(0x808080);
scene.add(ambient);

// Add a GUI to change objects.
var gui = new dat.GUI({width:160});
var controller = new THREE.Object3D();
controller.objects = [];
controller.scene = scene;
controller.gui = gui;
controller.color = 0xFFFFFF;
controller.createNew = function() {
  var cube = new THREE.Mesh(
    new THREE.CubeGeometry(20,20,20),
    new THREE.MeshLambertMaterial({color: 0xFFFFFF})
  );
  cube.castShadow = true;
  cube.receiveShadow = true;
  this.scene.add(cube);
  this.objects.push(cube);
  this.setCurrent(cube);
};
controller.setCurrent = function(current) {
  if (this.current)
    this.current.material.ambient.setHex(0x000000);
  this.current = current;
  if (this.current) {
    this.current.material.ambient.setHex(0x888800);
    this.x.setValue(current.position.x);
    this.y.setValue(current.position.y);
    this.z.setValue(current.position.z);
    this.sX.setValue(current.scale.x);
    this.sY.setValue(current.scale.y);
    this.sZ.setValue(current.scale.z);
  }
};
controller.proxy = function(propertyChain, min, max) {
  var controller = this;
  var tgt = controller;
  for (var i=0; i<propertyChain.length-1; i++) {
    tgt = tgt[propertyChain[i]];
  }
  var last = propertyChain[propertyChain.length-1];
  var ctrl = controller.gui.add(tgt, last, min, max);
  ctrl.onChange(function(v) {
    console.log("Change!");
    var t = controller.current;
    for (var i=0; i<propertyChain.length-1; i++) {
      t = t[propertyChain[i]];
    }
    t[last] = v;
  });
  return ctrl;
}

controller.x = controller.proxy(['position', 'x'], -50, 50);
controller.y = controller.proxy(['position', 'y'], -50, 50);
controller.z = controller.proxy(['position', 'z'], -50, 50);

controller.sX = controller.proxy(['scale', 'x'], 0.1, 6).step(0.1).name('Width');
controller.sY = controller.proxy(['scale', 'y'], 0.1, 6).step(0.1).name('Height');
controller.sZ = controller.proxy(['scale', 'z'], 0.1, 6).step(0.1).name('Depth');

gui.add(controller, 'createNew');

controller.createNew();


// Add some hacky interactive viewing controls on mousedown/move
renderer.render(scene, camera);
var sx = 0, sy = 0;
var rotation = 1;
var down = false;
var projector = new THREE.Projector();
camera.position.x = Math.cos(rotation)*150;
camera.position.z = Math.sin(rotation)*150;
window.onmousedown = function (ev){
  if (ev.target == renderer.domElement && ev.which == 1) {
    down = true;
    sx = ev.clientX;
    sy = ev.clientY;
    // Project a ray for picking
    var v = new THREE.Vector3((sx/width) * 2 - 1, -(sy/height) * 2 + 1, 0.5);
    projector.unprojectVector(v, camera);
    var ray = new THREE.Raycaster(camera.position, 
				  v.subVectors(v,camera.position).normalize());
    var intersects = ray.intersectObjects(controller.objects, true);
    if (intersects.length > 0) {
      controller.setCurrent(intersects[0].object);
    }
  }
};
window.onmouseup = function(ev) { if (ev.which == 1) down = false; };
window.onmousemove = function(ev) {
  if (down) {
    var dx = ev.clientX - sx;
    var dy = ev.clientY - sy;
    rotation += dx/100;
    camera.position.x = Math.cos(rotation)*150;
    camera.position.z = Math.sin(rotation)*150;
    camera.position.y += dy;
    sx += dx;
    sy += dy;
  }
}
renderer.autoClear = false;
function animate() {
  renderer.clear();
  camera.lookAt( scene.position );
  // Render both scenes.
  renderer.render(scene, camera);
  renderer.render(coordScene, camera);
  window.requestAnimationFrame(animate, renderer.domElement);
};
animate();