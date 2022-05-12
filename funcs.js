function ChangeCamVIew(canvas, camera) {
  var dragging = false;        
  var lastX = -1, lastY = -1;   

  canvas.onmousedown = function(ev) {   
    var x = ev.clientX, y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      lastX = x; lastY = y;
      dragging = true;
    }
  };

  canvas.onmouseup = function(ev) { dragging = false;  };

  canvas.onmousemove = function(ev) { 
    var x = ev.clientX, y = ev.clientY;
    if (dragging) {
      var factor = 100/canvas.height; 
      var dx = factor * (x - lastX);
      var dy = factor * (y - lastY);
      camera.pitch = Math.max(Math.min(camera.pitch  - dy, 90.0), -90.0);
      camera.yaw = (camera.yaw - dx + 360.0) % 360.0;
      camera.computeViewMatrix();
      camera.computeViewPoint();
    }
    lastX = x, lastY = y;
  };

  canvas.onwheel = function(ev) { 
    ev.preventDefault();
    var deltaY = ev.deltaY ;

    var change;

    if (deltaY > 0)
    {
      change = [0,0,5,0]
    } else if (deltaY < 0)
    {
      change = [0,0,-5,0]
    }

    var ivm = new Matrix4();
    var temp_mat = new Matrix4();
    ivm.setInverseOf(camera.vm);
    var transformedEyeDirection;
    
  transformedEyeDirection = ivm.multiplyVector4(new Vector4(change));
  camera.location = [camera.location[0] + transformedEyeDirection.elements[0],
                      camera.location[1] + transformedEyeDirection.elements[1],
                      camera.location[2] + transformedEyeDirection.elements[2]]
  temp_mat.setTranslate(-transformedEyeDirection.elements[0],-transformedEyeDirection.elements[1],-transformedEyeDirection.elements[2]);
  camera.vm.multiply(temp_mat)
  camera.computeViewPoint()
  
  }; 

  document.onkeydown = (ev) => {
    ev.preventDefault();

  if(ev.key == "ArrowDown"){
    camera.pitch += 2
    ev.preventDefault();
  }
  else if(ev.key == "ArrowUp"){
    camera.pitch -= 2
    ev.preventDefault();
  }
  else if(ev.key == "ArrowLeft"){
    camera.yaw -= 2
    ev.preventDefault();
  }
  else if(ev.key == "ArrowRight"){
    camera.yaw += 2
    ev.preventDefault();
  }

  camera.computeViewMatrix();

  var ivm = new Matrix4();
  var temp_mat = new Matrix4();
  ivm.setInverseOf(camera.vm);
  var transformedEyeDirection;
  var change;
  if(ev.key == "w"){
    change = [0,0.5,0,0]
  }
  else if(ev.key == "s"){
    change = [0,-0.5,0,0]
  }
  else if(ev.key == "a"){
    change = [-0.5,0,0,0]
  }
  else if(ev.key == "d"){
    change = [0.5,0,0,0]
  }
  else if(ev.key == "r"){
    change = [0,0,-0.5,0]
  }
  else if(ev.key == "f"){
    change = [0,0,0.5,0]
  }

  transformedEyeDirection = ivm.multiplyVector4(new Vector4(change));
  camera.location = [camera.location[0] + transformedEyeDirection.elements[0],
                      camera.location[1] + transformedEyeDirection.elements[1],
                      camera.location[2] + transformedEyeDirection.elements[2]]
  temp_mat.setTranslate(-transformedEyeDirection.elements[0],-transformedEyeDirection.elements[1],-transformedEyeDirection.elements[2]);
  camera.vm.multiply(temp_mat)
  camera.computeViewPoint()

  };
}

var Last_Animate = Date.now();
function animate(angle, step) {
  ANGLE_STEP = step;
  var now = Date.now();
  var elapsed = (now - Last_Animate);
  Last_Animate = now;
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000;
  return newAngle;
}

function initElementArrayBufferForLaterUse(gl, data, type) {
  var buffer = gl.createBuffer(); 
  if (!buffer) {
    return null;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

  buffer.type = type;

  return buffer;
}

function initVertexBuffers(gl) {
  var SPHERE_DIV = 100;

  var i, ai, si, ci;
  var j, aj, sj, cj;
  var p1, p2;

  var vertices1 = [];
  var indices = [];
  var texCoord = []

  for (j = 0; j <= SPHERE_DIV; j++) {
    aj = j * Math.PI / SPHERE_DIV;
    sj = Math.sin(aj);
    cj = Math.cos(aj);
    for (i = 0; i <= SPHERE_DIV; i++) {
      ai = i * 2 * Math.PI / SPHERE_DIV;
      si = Math.sin(ai);
      ci = Math.cos(ai);

      vertices1.push(si * sj);  // X
      vertices1.push(cj);       // Y
      vertices1.push(ci * sj);  // Z

      texCoord.push(i / SPHERE_DIV)
      texCoord.push(1 - j / SPHERE_DIV)
    }
  }

  vertices = new Float32Array(vertices1)

  for (j = 0; j < SPHERE_DIV; j++) {
    for (i = 0; i < SPHERE_DIV; i++) {
      p1 = j * (SPHERE_DIV + 1) + i;
      p2 = p1 + (SPHERE_DIV + 1);

      indices.push(p1);
      indices.push(p2);
      indices.push(p1 + 1);

      indices.push(p1 + 1);
      indices.push(p2);
      indices.push(p2 + 1);
    }
  }

  indices = new Uint16Array(indices);

  texCoords = new Float32Array(texCoord)

  var o = new Object(); 

  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  o.normalBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_SHORT);
  if (!o.vertexBuffer || !o.normalBuffer || !o.texCoordBuffer || !o.indexBuffer) return null;

  o.numIndices = indices.length;

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}
function initVertexBuffers2(gl, R) {

  var vertices_arr = []
  r = R;
  for (var i = 0; i <= 200; i++) {
    var x = r * Math.cos((i * Math.PI / 100))
    var z = r * Math.sin((i * Math.PI / 100))
    vertices_arr.push(x, 0, z)
  }
  var verticesColors = new Float32Array((vertices_arr))
  var normal = [];
  for (i = 0; i <= 200; i++) {
    normal.push(0)
    normal.push(0)
    normal.push(1)
  }
  var normals = new Float32Array(normal);
  indc = []
  for (j = 0; j <= 200; j += 3) {
    indc.push(j)
    indc.push(j + 1)
    indc.push(j + 2)
  }
  var indices = new Uint8Array(indc);
  var orb = new Object();
  orb.vertexBuffer = initArrayBufferForLaterUse(gl, verticesColors, 3, gl.FLOAT);
  orb.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
  orb.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  if (!orb.vertexBuffer || !orb.normalBuffer || !orb.indexBuffer) return null;
  orb.numIndices = indices.length;
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  return orb;
}
function draw_orbits(gl, program, orb, viewProjMatrix) {
  g_mvpMatrix.set(viewProjMatrix);
  gl.uniformMatrix4fv(program.MvpMatrix, false, g_mvpMatrix.elements);

  gl.drawElements(gl.LINE_STRIP, orb.numIndices, orb.indexBuffer.type, 0);   
}
function draw_orbit_obj(gl, program, orb, viewProjMatrix) {

  gl.useProgram(program);   
  initAttributeVariable(gl, program.Position, orb.vertexBuffer); 
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, orb.indexBuffer);  
  draw_orbits(gl, program, orb, viewProjMatrix);  
}
function draw_planets(obj, gl, program, o, textures, x, y, z, Scx, Scy, Scz, Rx, Ry, Rz, angle, viewProjMatrix) {

  gl.useProgram(program);   
  gl.uniform3f(program.LightColor, 1.0, 1.0, 1.0);
  gl.uniform3f(program.LightPosition, 0, 0, 0);
  gl.uniform3f(program.AmbientLight, 0.2, 0.2, 0.2);

  obj_texture = textures[obj];

  if (obj == 0) {
    gl.uniform3f(program.AmbientLight, 1.2, 1.2, 1.2);
  }
  
  initAttributeVariable(gl, program.Position, o.vertexBuffer);  
  initAttributeVariable(gl, program.Normal, o.normalBuffer);    
  initAttributeVariable(gl, program.TexCoord, o.texCoordBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer); 
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, obj_texture);

  draw_sphere(gl, program, o, x, y, z, Scx, Scy, Scz, Rx, Ry, Rz, angle, viewProjMatrix); 
}
function draw_sphere(gl, program, o, x, y, z, Scx, Scy, Scz, Rx, Ry, Rz, angle, viewProjMatrix) {

  g_modelMatrix.setTranslate(x, y, z);
  g_modelMatrix.rotate(angle, Rx, Ry, Rz);
  g_modelMatrix.scale(Scx, Scy, Scz);
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(program.NormalMatrix, false, g_normalMatrix.elements);

  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(program.MvpMatrix, false, g_mvpMatrix.elements);
  gl.uniformMatrix4fv(program.ModelMatrix, false, g_modelMatrix.elements);
  gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);   
}
function initAttributeVariable(gl, a_attribute, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}

var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();
function initArrayBufferForLaterUse(gl, data, num, type) {
  var buffer = gl.createBuffer();  
  if (!buffer) {
    return null;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  buffer.num = num;
  buffer.type = type;

  return buffer;
}

class Camera {
  constructor(location, pitch, yaw) {
    this.location = location;
    this.pitch = pitch;
    this.yaw = yaw;

    var ProjMatrix = new Matrix4();
    var viewMatrix = new Matrix4();
    var viewProjMatrix = new Matrix4();
    var canvas = document.getElementById('mycanvas');
    ProjMatrix.setPerspective(35.0, canvas.width / canvas.height, 0.1, 10000.0)

    this.vm = viewMatrix;
    this.pm = ProjMatrix;
    this.vp = viewProjMatrix;
    this.computeViewMatrix();
    this.computeViewPoint();
  }
  computeViewMatrix() {
    this.vm.setRotate(this.pitch, 1, 0, 0);
    this.vm.rotate(this.yaw, 0, 1, 0);
    this.vm.translate(-this.location[0], -this.location[1], -this.location[2]);
  }
  computeViewPoint() {
    this.vp.set(this.pm).multiply(this.vm)
  }
}

function initTextures(gl, program) {
  var texture0 = gl.createTexture();  
  var texture1 = gl.createTexture();   
  var texture2 = gl.createTexture();   
  var texture3 = gl.createTexture();  
  var texture4 = gl.createTexture();  
  var texture5 = gl.createTexture();   
  var texture6 = gl.createTexture();   
  var texture7 = gl.createTexture();   
  var texture8 = gl.createTexture();   
  if (!texture0 || !texture1 || !texture2 || !texture3 || !texture4 || !texture5 || !texture6 || !texture7 || !texture8) {
    return null;
  }
  var image0 = new Image();  
  var image1 = new Image();  
  var image2 = new Image();  
  var image3 = new Image();  
  var image4 = new Image();  
  var image5 = new Image();  
  var image6 = new Image();  
  var image7 = new Image();  
  var image8 = new Image();  
  if (!image0 || !image1 || !image2 || !image3 || !image4 || !image5 || !image6 || !image7 || !image8) {
    return null;
  }
  var textures = [];
  textures.push(texture0, texture1, texture2, texture3, texture4, texture5, texture6, texture7, texture8)

  image0.onload = function () {
    loadTexture(gl, program, texture0, image0)
  };
  image1.onload = function () {
    loadTexture(gl, program, texture1, image1)
  };
  image2.onload = function () {
    loadTexture(gl, program, texture2, image2)
  };
  image3.onload = function () {
    loadTexture(gl, program, texture3, image3)
  };
  image4.onload = function () {
    loadTexture(gl, program, texture4, image4)
  };
  image5.onload = function () {
    loadTexture(gl, program, texture5, image5)
  };
  image6.onload = function () {
    loadTexture(gl, program, texture6, image6)
  };
  image7.onload = function () {
    loadTexture(gl, program, texture7, image7)
  };
  image8.onload = function () {
    loadTexture(gl, program, texture8, image8)
  };
  
  image3.src = './img/earth.jpg';
  image0.src = './img/sun.jpg';
  image4.src = './img/mars.jpg';
  image1.src = './img/mercury.jpg';
  image2.src = './img/venus.jpg';
  image5.src = './img/jupiter.jpg';
  image6.src = './img/saturn.jpg';
  image7.src = './img/uranus.jpg';
  image8.src = './img/neptune.jpg';

  image3.crossOrigin = 'anonymous';
  image0.crossOrigin = 'anonymous';
  image4.crossOrigin = 'anonymous';
  image1.crossOrigin = 'anonymous';
  image2.crossOrigin = 'anonymous';
  image5.crossOrigin = 'anonymous';
  image6.crossOrigin = 'anonymous';
  image7.crossOrigin = 'anonymous';
  image8.crossOrigin = 'anonymous';

  return textures;
}

function loadTexture(gl, program, texture, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.useProgram(program);
  gl.uniform1i(program.u_Sampler, 0);
  gl.bindTexture(gl.TEXTURE_2D, null); 
}