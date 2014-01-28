// Create a renderer
var renderer = new THREE.WebGLRenderer({antialias: true});
var width = 800;
var height = 600;
renderer.setSize(width, height);

// Plug it into the document
document.body.appendChild(renderer.domElement);

// Make it pretty!
renderer.setClearColor(0xEEEEEE, 1.0);

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

// The cube our UI will manipulate
var cube = new THREE.Mesh(
  new THREE.CubeGeometry(20,20,20),
  new THREE.MeshPhongMaterial({color: 0xFFFFFF})
);
scene.add(cube);

// Add scene lighting
var light = new THREE.PointLight(0xFFCC99);
light.position.set(150, 200, 300);
scene.add(light);

var ambient = new THREE.PointLight(0x333366);
ambient.position.set(-150, -200, -300);
scene.add(ambient);


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

// Add a GUI to change scale.
var gui = new dat.GUI();
gui.add(cube.scale, 'x').min(0.1).max(10).step(0.1);
gui.add(cube.scale, 'y', 0.1, 10, 0.1);
gui.add(cube.scale, 'z', 0.1, 10, 0.1);



// Add some hacky interactive viewing controls on mousedown/move
renderer.render(scene, camera);
var sx = 0, sy = 0;
var rotation = 1;
var down = false;
camera.position.x = Math.cos(rotation)*150;
camera.position.z = Math.sin(rotation)*150;
window.onmousedown = function (ev){
  if (ev.target == renderer.domElement && ev.which == 1) {
    down = true;
    sx = ev.clientX;
    sy = ev.clientY;
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