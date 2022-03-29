$(function() {
    main();
});

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
function main() {
  var canvas = document.getElementById('mycanvas');

  var gl = getWebGLContext(canvas);
  if (!gl) {
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.enable(gl.DEPTH_TEST);

  var orbit_object = createProgram(gl, SOLID_VSHADER_SOURCE, SOLID_FSHADER_SOURCE);

  orbit_object.The_Position = gl.getAttribLocation(orbit_object, 'The_Position');
  orbit_object.The_MvpMatrix = gl.getUniformLocation(orbit_object, 'The_MvpMatrix');
  if (orbit_object.The_Position < 0 || !orbit_object.The_MvpMatrix) {
    return;
  }

  var planet_object = createProgram(gl, TEXTURE_VSHADER_SOURCE, TEXTURE_FSHADER_SOURCE);
  if (!planet_object) {
    return;
  }

  planet_object.The_ModelMatrix = gl.getUniformLocation(planet_object, 'The_ModelMatrix');
  planet_object.The_LightColor = gl.getUniformLocation(planet_object, 'The_LightColor');
  planet_object.The_LightPosition = gl.getUniformLocation(planet_object, 'The_LightPosition');
  planet_object.The_AmbientLight = gl.getUniformLocation(planet_object, 'The_AmbientLight');
  planet_object.The_Position = gl.getAttribLocation(planet_object, 'The_Position');
  planet_object.The_Normal = gl.getAttribLocation(planet_object, 'The_Normal');
  planet_object.The_TexCoord = gl.getAttribLocation(planet_object, 'The_TexCoord');
  planet_object.The_MvpMatrix = gl.getUniformLocation(planet_object, 'The_MvpMatrix');
  planet_object.The_NormalMatrix = gl.getUniformLocation(planet_object, 'The_NormalMatrix');
  planet_object.The_Sampler0 = gl.getUniformLocation(planet_object, 'The_Sampler0');

  if (planet_object.The_Position < 0 || planet_object.The_Normal < 0 || planet_object.The_TexCoord < 0 ||
    !planet_object.The_MvpMatrix || !planet_object.The_NormalMatrix || !planet_object.The_Sampler0
    || !planet_object.The_ModelMatrix || !planet_object.The_LightColor || !planet_object.The_LightPosition || !planet_object.The_AmbientLight) {
    return;
  }
  
  var sphere = initVertexBuffers(gl);
  var orbits0 = initVertexBuffers2(gl, 8.8);
  var orbits1 = initVertexBuffers2(gl, 12.2);
  var orbits2 = initVertexBuffers2(gl, 15);
  var orbits3 = initVertexBuffers2(gl, 20);
  var orbits4 = initVertexBuffers2(gl, 56);
  var orbits5 = initVertexBuffers2(gl, 100);
  var orbits6 = initVertexBuffers2(gl, 195);
  var orbits7 = initVertexBuffers2(gl, 305);
  var orbits = []
  orbits.push(orbits0, orbits1, orbits2, orbits3, orbits4, orbits5, orbits6, orbits7)

  if (!sphere || !orbits0 || !orbits1 || !orbits2 || !orbits3
    || !orbits4 || !orbits5 || !orbits6 || !orbits7) {
    return;
  }

  var texture_0 = initTextures(gl, planet_object);
  if (!texture_0) {
    return;
  }
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  Ex = Ey = Ez = Sx = Sy = Sz = Mx = My = Mz = 0;
  Merx = Mery = Merz = Venx = Veny = Venz = Jupx = Jupy = Jupz = 0;
  Satx = Saty = Satz = Urnx = Urny = Urnz = Nepx = Nepy = Nepz = 0;
  revolve_angle = currentAngle_earth_rev = currentAngle_earth = currentAngle_mars = currentAngle_sun = 0.0;
  currentAngle_mercury = currentAngle_venus = currentAngle_jupiter = 0.0;
  currentAngle_saturn = currentAngle_uranus = currentAngle_neptune = 0.0;
  currentAngle_earth_evolve = 0;
  Rx = 0.0;
  Ry = 1.0;
  Rz = 0.0;
  var speed = 0.001;

  document.addEventListener('keydown', (ev) => {

    if (ev.key == '+')
    {
      oldSpeedMult+=1
      speed *= 1.4
      $("#rangespeed")[0].stepUp();
    } else if (ev.key == '-')
    {
      oldSpeedMult-=1
      speed *= 1.4
      $("#rangespeed")[0].stepDown();
    }

    if (oldSpeedMult <= 1)
    {
      oldSpeedMult = 1;
      speed = 0.001;
    } 
  })
  
  var oldSpeedMult = 1;
  $("#rangespeed").on("input", function(ev) {
    if (ev.target.value == 1)
    {
      speed = 0.001;
    } else if (ev.target.value > oldSpeedMult)
    {
      speed *= 1.4
    } else if (ev.target.value < oldSpeedMult)
    {
      speed /= 1.4
    }
    oldSpeedMult = ev.target.value;
  });

  var camera = new Camera([-25, 25, -45], 20, 125, canvas.width, canvas.height)
  changemycam(canvas, camera);
  var tick = function () {
    viewProjMatrix = camera.vp;

    orbits.forEach(my_go => {
      draw_orbit_obj(gl, orbit_object, my_go, viewProjMatrix);
    });
    revolve_angle = animate(revolve_angle, 1)
    draw_planets(0, gl, planet_object, sphere, texture_0, Sx, Sy, Sz, 5, 5, 5, Rx, Ry, Rz, currentAngle_sun, viewProjMatrix);

    Merx = Math.cos(revolve_angle * speed * 4.147) * (3.9 + 5);
    Merz = Math.sin(revolve_angle * speed * 4.147) * (3.9 + 5);
    currentAngle_mercury = revolve_angle * 0.016 * 20000 * speed;
    draw_planets(1, gl, planet_object, sphere, texture_0, Merx, Mery, Merz, 0.383, 0.383, 0.383, Rx, Ry, Rz, currentAngle_mercury, viewProjMatrix);
    currentAngle_sun = revolve_angle * 0.039 * 20000 * speed;

    Venx = Math.cos(revolve_angle * speed * 1.622) * (7.23 + 5);
    Venz = Math.sin(revolve_angle * speed * 1.622) * (7.23 + 5);
    draw_planets(2, gl, planet_object, sphere, texture_0, Venx, Veny, Venz, 0.949, 0.949, 0.949, Rx, Ry, Rz, currentAngle_venus, viewProjMatrix);
    currentAngle_venus = revolve_angle * 0.004 * 20000 * speed;

    Ex = (Math.cos(revolve_angle * speed) * (10 + 5));
    Ez = (Math.sin(revolve_angle * speed) * (10 + 5));
    draw_planets(3, gl, planet_object, sphere, texture_0, Ex, Ey, Ez, 1, 1, 1, Rx, Ry, Rz, currentAngle_earth, viewProjMatrix);
    currentAngle_earth = revolve_angle * 20000 * speed;

    Mx = Math.cos(revolve_angle * speed * 0.532) * (15.24 + 5);
    Mz = Math.sin(revolve_angle * speed * 0.532) * (15.24 + 5);
    draw_planets(4, gl, planet_object, sphere, texture_0, Mx, My, Mz, 0.532, 0.532, 0.532, Rx, Ry, Rz, currentAngle_mars, viewProjMatrix);
    currentAngle_mars = revolve_angle * 0.97 * 20000 * speed;


    Jupx = Math.cos(revolve_angle * speed * 0.084) * (52.03 + 5);
    Jupz = Math.sin(revolve_angle * speed * 0.084) * (52.03 + 5);
    draw_planets(5, gl, planet_object, sphere, texture_0, Jupx, Jupy, Jupz, 10.97, 10.97, 10.97, Rx, Ry, Rz, currentAngle_jupiter, viewProjMatrix);
    currentAngle_jupiter = revolve_angle * 2.41 * 20000 * speed;

    Satx = Math.cos(revolve_angle * speed * 0.033) * (95.39 + 5);
    Satz = Math.sin(revolve_angle * speed * 0.033) * (95.39 + 5);
    draw_planets(6, gl, planet_object, sphere, texture_0, Satx, Saty, Satz, 9.14, 9.14, 9.14, Rx, Ry, Rz, currentAngle_saturn, viewProjMatrix);
    currentAngle_saturn = revolve_angle * 2.26 * 20000 * speed;

    Urnx = Math.cos(revolve_angle * speed * 0.0119) * (190 + 5);
    Urnz = Math.sin(revolve_angle * speed * 0.0119) * (190 + 5);
    draw_planets(7, gl, planet_object, sphere, texture_0, Urnx, Urny, Urnz, 3.98, 3.98, 3.98, Rx, Ry, Rz, currentAngle_uranus, viewProjMatrix);
    currentAngle_uranus = revolve_angle * 1.38 * 20000 * speed;

    Nepx = Math.cos(revolve_angle * speed * 0.0061) * (300 + 5);
    Nepz = Math.sin(revolve_angle * speed * 0.0061) * (300 + 5);
    draw_planets(8, gl, planet_object, sphere, texture_0, Nepx, Nepy, Nepz, 3.86, 3.86, 3.86, Rx, Ry, Rz, currentAngle_neptune, viewProjMatrix);
    currentAngle_neptune = revolve_angle * 1.49 * 20000 * speed;
    window.requestAnimationFrame(tick, canvas);

  };
  tick();
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
  gl.uniformMatrix4fv(program.The_MvpMatrix, false, g_mvpMatrix.elements);

  gl.drawElements(gl.LINE_STRIP, orb.numIndices, orb.indexBuffer.type, 0);   
}
function draw_orbit_obj(gl, program, orb, viewProjMatrix) {

  gl.useProgram(program);   
  initAttributeVariable(gl, program.The_Position, orb.vertexBuffer); 
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, orb.indexBuffer);  
  draw_orbits(gl, program, orb, viewProjMatrix);  
}
function draw_planets(obj, gl, program, o, textures, x, y, z, Scx, Scy, Scz, Rx, Ry, Rz, angle, viewProjMatrix) {

  gl.useProgram(program);   
  gl.uniform3f(program.The_LightColor, 1.0, 1.0, 1.0);
  gl.uniform3f(program.The_LightPosition, 0, 0, 0);
  gl.uniform3f(program.The_AmbientLight, 0.2, 0.2, 0.2);

  obj_texture = textures[obj];

  if (obj == 0) {
    gl.uniform3f(program.The_AmbientLight, 1.2, 1.2, 1.2);
  }
  
  initAttributeVariable(gl, program.The_Position, o.vertexBuffer);  
  initAttributeVariable(gl, program.The_Normal, o.normalBuffer);    
  initAttributeVariable(gl, program.The_TexCoord, o.texCoordBuffer);
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
  gl.uniformMatrix4fv(program.The_NormalMatrix, false, g_normalMatrix.elements);

  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(program.The_MvpMatrix, false, g_mvpMatrix.elements);
  gl.uniformMatrix4fv(program.The_ModelMatrix, false, g_modelMatrix.elements);
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

var last = Date.now();
function animate(angle, step) {
  ANGLE_STEP = step;
  var now = Date.now();
  var elapsed = (now - last);
  last = now;
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000;
  return newAngle;
}


function changemycam(canvas, camera) {
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

var SOLID_VSHADER_SOURCE =
  'attribute vec4 The_Position;\n' +
  'uniform mat4 The_MvpMatrix;\n' +
  'varying vec4 The_Color;\n' +
  'void main() {\n' +
  '  vec4 color = vec4(0.7, 0.7, 0.6, 0.0);\n' +     
  '  gl_Position = The_MvpMatrix * The_Position;\n' +
  '  The_Color = vec4(color.rgb, color.a);\n' +
  '}\n';

var SOLID_FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 The_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = The_Color;\n' +
  '}\n';

var TEXTURE_VSHADER_SOURCE =
  'attribute vec4 The_Position;\n' +
  'attribute vec4 The_Normal;\n' +
  'attribute vec2 The_TexCoord;\n' +
  'uniform mat4 The_MvpMatrix;\n' +
  'varying vec3 The_LightColor1;\n' +
  'uniform vec3 The_LightColor;\n' +
  'uniform vec3 The_LightPosition;\n' +
  'uniform mat4 The_ModelMatrix;\n' +
  'uniform mat4 The_NormalMatrix;\n' +
  'uniform vec3 The_AmbientLight;\n' +
  'varying vec3 The_AmbientLight1;\n' +
  'varying float The_NdotL;\n' +
  'varying vec2 The_TexCoord_var;\n' +
  'void main() {\n' +
  '  gl_Position = The_MvpMatrix * The_Position;\n' +
  '  The_LightColor1 = The_LightColor;\n' +
  '  The_AmbientLight1 = The_AmbientLight;\n' +
  '  vec3 normal = normalize(vec3(The_NormalMatrix * The_Normal));\n' +
  '  vec4 vertexPosition = The_ModelMatrix * The_Position;\n' +
  '  vec3 lightDirection = normalize(The_LightPosition - vec3(vertexPosition));\n' +
  '  The_NdotL = max(dot(normal, lightDirection), 0.0);\n' +
  '  The_TexCoord_var = The_TexCoord;\n' +
  '}\n';

var TEXTURE_FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec3 The_LightColor1;\n' +
  'varying vec3 The_AmbientLight1;\n' +
  'uniform sampler2D The_Sampler0;\n' +
  'varying vec2 The_TexCoord_var;\n' +
  'varying float The_NdotL;\n' +
  'void main() {\n' +
  '  vec4 color0 = texture2D(The_Sampler0, The_TexCoord_var);\n' +
  '  gl_FragColor = vec4(The_LightColor1 * color0.rgb * The_NdotL + The_AmbientLight1 * color0.rgb , color0.a);\n' +
  '}\n';