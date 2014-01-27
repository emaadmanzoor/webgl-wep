window.onload = main;

function main() {
  // Get A WebGL context
  var canvas = document.getElementById("canvas");
  var gl = getWebGLContext(canvas);
  if (!gl) {
    return;
  }

  // setup GLSL program
  vertexShader = createShaderFromString(gl, gl.VERTEX_SHADER,
    "attribute vec2 a_position; \n" +
    "void main() { \n" +
    "    gl_Position = vec4(a_position, 0, 1); \n" +
    "}"
  );
  fragmentShader = createShaderFromString(gl, gl.FRAGMENT_SHADER,
    "void main() { \n" +
    "   gl_FragColor = vec4(0,1,0,1);  // green \n" +
    "}"
  );
  program = createProgram(gl, [vertexShader, fragmentShader]);
  gl.useProgram(program);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer and put a single clipspace rectangle in
  // it (2 triangles)
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
     1.0,  1.0]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // draw
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
