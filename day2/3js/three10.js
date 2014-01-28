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
renderer.shadowCameraFov = 50;
renderer.shadowMapWidth = 1024;;
renderer.shadowMapHeight = 1024;

// Create a camera
// new THREE.PerspectiveCamera( FOV, viewAspectRatio, zNear, zFar );
var camera = new THREE.PerspectiveCamera(45, width/height, 1, 10000);
camera.position.z = -400;
camera.position.x = 200;
camera.position.y = 350;


// Make a scene
var scene = new THREE.Scene();

new THREE.ColladaLoader().load(
     'examples/models/collada/monster/monster.dae', function(collada) {
  var model = collada.scene;
  skin = collada.skins[0];
  model.scale.set(0.1, 0.1, 0.1);
  model.rotation.x = -Math.PI/2;
  // Shadows have to be set on THREE.Mesh children.
  // children[1] just happens to be a THREE.Mesh in this case.
  var mesh = model.children[1];
  mesh.castShadow = mesh.receiveShadow = true;
  scene.add(model);
});


var plane = new THREE.Mesh(
  new THREE.PlaneGeometry(400, 200, 10, 10), 
  new THREE.MeshLambertMaterial({color: 0xffffff}));
plane.rotation.x = -Math.PI/2;
plane.position.y = -25.1;
plane.receiveShadow = true;
scene.add(plane);

var light = new THREE.SpotLight();
light.castShadow = true;
light.position.set( 170, 330, -160 );
scene.add(light);

// Add some hacky interactive viewing controls on mousedown/move
renderer.render(scene, camera);
var paused = false;
var down = false;
var sx = 0, sy = 0;
window.onmousedown = function (ev){
  down = true; sx = ev.clientX; sy = ev.clientY;
};
window.onmouseup = function(){ down = false; };
var rotation = Math.PI/2;
camera.position.x = Math.cos(rotation)*300;
camera.position.z = Math.sin(rotation)*300;
window.onmousemove = function(ev) {
  if (down) {
    var dx = ev.clientX - sx;
    var dy = ev.clientY - sy;
    rotation += dx * 0.01;
    camera.position.x = Math.cos(rotation)*300;
    camera.position.z = Math.sin(rotation)*300;
    camera.position.y += dy;
    sx += dx;
    sy += dy;
  }
}
var st = 0;
var skin = null;
function animate() {
  if ( st > 30 ) st = 0;

  if ( skin ) {
    for ( var i = 0; i < skin.morphTargetInfluences.length; i++ ) {
      skin.morphTargetInfluences[ i ] = 0;
    }
    skin.morphTargetInfluences[ Math.floor( st ) ] = 1;
    st += 0.5;
  }
  camera.lookAt( scene.position );
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate, renderer.domElement);
};
animate();
