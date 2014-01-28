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
camera.position.z = 160;
camera.position.y = 40;
camera.position.x = 40;

// Make a scene
var scene = new THREE.Scene();

var uniforms = {
  time : { type: "f", value: 1.0 },
  size : { type: "v2", value: new THREE.Vector2(width,height) }
};

var shaderMaterial = new THREE.ShaderMaterial({
  uniforms : uniforms,
  vertexShader : document.getElementById('vertex').textContent,
  fragmentShader : document.getElementById('fragment').textContent
});

var meshCube = new THREE.Mesh(
  new THREE.CubeGeometry(50,50,50, 20,20,20), // 20 segments
  shaderMaterial
);
scene.add(meshCube);

function animate(t) {
  uniforms.time.value += 0.05;
  meshCube.rotation.y += 0.01;
  meshCube.rotation.z += 0.02;

  // you need to update lookAt every frame when camera is moving.
  camera.lookAt(scene.position);

  // renderer automatically clears unless autoClear = false
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate, renderer.domElement);
};
animate(new Date().getTime());
