window.onload = main;

function main() {
  // Get A WebGL context
  var canvas = document.getElementById("canvas");
  var gl = getWebGLContext(canvas);
  window.gl = gl;
  if (!gl) {
    return;
  }

  // setup GLSL program
  vertexShader = createShaderFromString(gl, gl.VERTEX_SHADER,
    "uniform mat4 u_viewport; \n" +
    "attribute vec2 a_position; \n" +
    "varying vec4 v_color; \n" +
    "void main() { \n" +
    "    gl_Position = vec4(u_viewport * vec4(a_position, 0, 1)); \n" +
    "    vec2 pos = gl_Position.xy; \n" +
    "    v_color = vec4(0.5 * pos.x + 0.5, 0.5 * pos.y + 0.5, 0, 1); \n" +
    "}"
  );
  fragmentShader = createShaderFromString(gl, gl.FRAGMENT_SHADER,
    "precision highp float; \n" +
    "varying vec4 v_color; \n" +
    "void main() { \n" +
    "   gl_FragColor = v_color; \n" +
    "}"
  );
  program = createProgram(gl, [vertexShader, fragmentShader]);
  gl.useProgram(program);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer and put a single viewport-space rectangle in
  // it (2 triangles)
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  var width = gl.drawingBufferWidth * devicePixelRatio;
  var height = gl.drawingBufferHeight * devicePixelRatio;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0,     0,
    width, 0,
    0,     height,

    0,     height,
    width, 0,
    width, height]), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  var u_viewport = gl.getUniformLocation(program, "u_viewport");
  gl.uniformMatrix4fv(u_viewport, false, new Float32Array([
    2.0/width, 0,          0, 0,
    0,         2.0/height, 0, 0,
    0,         0,          1, 0,
    -1,       -1,          0,  1]));

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
