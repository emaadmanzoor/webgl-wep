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
camera.position.z = 500;
camera.position.y = 150;
//camera.position.x = 0;

// Make a scene
var scene = new THREE.Scene();

// Draw some text into canvas element
 var c = document.createElement('canvas');
var ctx = c.getContext('2d');
var font = '64px Arial';
ctx.font = font;
var s = 'Hello, world!';
// Changing canvas size kills ctx settings like .font
c.width = ctx.measureText(s).width;
c.height = Math.ceil(64*1.25);
ctx.font = font;
ctx.fillText(s, 0, 64);


// Create a texture with that canvas
var tex = new THREE.Texture(c);
tex.needsUpdate = true;

var mat = new THREE.MeshBasicMaterial({map: tex});
mat.transparent = true;

var titleQuad = new THREE.Mesh(
  new THREE.PlaneGeometry(c.width, c.height),
  mat
);
titleQuad.doubleSided = true;
scene.add(titleQuad);

titleQuad.rotation.y = 0.5;

function animate(t) {
  // you need to update lookAt every frame when camera is moving.
  camera.lookAt(scene.position);

  // renderer automatically clears unless autoClear = false
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate, renderer.domElement);
};
animate(new Date().getTime());
