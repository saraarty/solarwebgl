function start() {
  var canvas = document.getElementById('mycanvas');

  var gl = getWebGLContext(canvas);
  if (!gl) {
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.enable(gl.DEPTH_TEST);

  var orbit_object = createProgram(gl, SOLID_VSHADER_SOURCE, SOLID_FSHADER_SOURCE);

  orbit_object.Position = gl.getAttribLocation(orbit_object, 'Position');
  orbit_object.MvpMatrix = gl.getUniformLocation(orbit_object, 'MvpMatrix');
  if (orbit_object.Position < 0 || !orbit_object.MvpMatrix) {
    return;
  }

  var planet_object = createProgram(gl, TEXTURE_VSHADER_SOURCE, TEXTURE_FSHADER_SOURCE);
  if (!planet_object) {
    return;
  }

  planet_object.ModelMatrix = gl.getUniformLocation(planet_object, 'ModelMatrix');
  planet_object.LightColor = gl.getUniformLocation(planet_object, 'LightColor');
  planet_object.LightPosition = gl.getUniformLocation(planet_object, 'LightPosition');
  planet_object.AmbientLight = gl.getUniformLocation(planet_object, 'AmbientLight');
  planet_object.Position = gl.getAttribLocation(planet_object, 'Position');
  planet_object.Normal = gl.getAttribLocation(planet_object, 'Normal');
  planet_object.TexCoord = gl.getAttribLocation(planet_object, 'TexCoord');
  planet_object.MvpMatrix = gl.getUniformLocation(planet_object, 'MvpMatrix');
  planet_object.NormalMatrix = gl.getUniformLocation(planet_object, 'NormalMatrix');
  planet_object.Sampler0 = gl.getUniformLocation(planet_object, 'Sampler0');

  if (planet_object.Position < 0 || planet_object.Normal < 0 || planet_object.TexCoord < 0 ||
    !planet_object.MvpMatrix || !planet_object.NormalMatrix || !planet_object.Sampler0
    || !planet_object.ModelMatrix || !planet_object.LightColor || !planet_object.LightPosition || !planet_object.AmbientLight) {
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

  var camera = new Camera([-40, 20, 45], 20, 60, canvas.width, canvas.height)
  ChangeCamVIew(canvas, camera);
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

$(function() {
  start();
});