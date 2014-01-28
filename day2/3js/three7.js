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
camera.position.z = 200;
camera.position.y = 150;
camera.position.x = 150;

// Make a scene
var scene = new THREE.Scene();

function v(x,y,z){ 
  return new THREE.Vertex(new THREE.Vector3(x,y,z)); 
}

var lineGeo = new THREE.Geometry();
lineGeo.vertices.push(
  v(-50, 0, 0), v(50, 0, 0),
  v(0, -50, 0), v(0, 50, 0),
  v(0, 0, -50), v(0, 0, 50)
);
var lineMat = new THREE.LineBasicMaterial({
  color: 0x000000, lineWidth: 1});
var line = new THREE.Line(lineGeo, lineMat);
line.type = THREE.Lines;
scene.add(line);


line.rotation.y = 0.5;

// Add some hacky interactive viewing controls on mousedown/move
renderer.render(scene, camera);
var last = new Date().getTime();
var sx = 0, sy = 0;
window.onmousedown = function (ev){
  sx = ev.clientX; sy = ev.clientY;
};
window.onmousemove = function(ev) {
  if (ev.which == 1) {
    var dx = ev.clientX - sx;
    var dy = ev.clientY - sy;
    line.rotation.y += dx*0.01;
    camera.position.y += dy;
    sx += dx;
    sy += dy;
  }
}
function animate(t) {
  last = t;
  renderer.clear();
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate, renderer.domElement);
};
animate(new Date().getTime());
