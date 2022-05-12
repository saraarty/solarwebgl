

var SOLID_VSHADER_SOURCE =
'attribute vec4 Position;\n' +
'uniform mat4 MvpMatrix;\n' +
'varying vec4 Color;\n' +
'void main() {\n' +
'  vec4 color = vec4(0.7, 0.7, 0.6, 0.0);\n' +     
'  gl_Position = MvpMatrix * Position;\n' +
'  Color = vec4(color.rgb, color.a);\n' +
'}\n';

var SOLID_FSHADER_SOURCE =
'#ifdef GL_ES\n' +
'precision mediump float;\n' +
'#endif\n' +
'varying vec4 Color;\n' +
'void main() {\n' +
'  gl_FragColor = Color;\n' +
'}\n';

var TEXTURE_VSHADER_SOURCE =
'attribute vec4 Position;\n' +
'attribute vec4 Normal;\n' +
'attribute vec2 TexCoord;\n' +
'uniform mat4 MvpMatrix;\n' +
'varying vec3 LightColor1;\n' +
'uniform vec3 LightColor;\n' +
'uniform vec3 LightPosition;\n' +
'uniform mat4 ModelMatrix;\n' +
'uniform mat4 NormalMatrix;\n' +
'uniform vec3 AmbientLight;\n' +
'varying vec3 AmbientLight1;\n' +
'varying float NdotL;\n' +
'varying vec2 TexCoord_var;\n' +
'void main() {\n' +
'  gl_Position = MvpMatrix * Position;\n' +
'  LightColor1 = LightColor;\n' +
'  AmbientLight1 = AmbientLight;\n' +
'  vec3 normal = normalize(vec3(NormalMatrix * Normal));\n' +
'  vec4 vertexPosition = ModelMatrix * Position;\n' +
'  vec3 lightDirection = normalize(LightPosition - vec3(vertexPosition));\n' +
'  NdotL = max(dot(normal, lightDirection), 0.0);\n' +
'  TexCoord_var = TexCoord;\n' +
'}\n';

var TEXTURE_FSHADER_SOURCE =
'#ifdef GL_ES\n' +
'precision mediump float;\n' +
'#endif\n' +
'varying vec3 LightColor1;\n' +
'varying vec3 AmbientLight1;\n' +
'uniform sampler2D Sampler0;\n' +
'varying vec2 TexCoord_var;\n' +
'varying float NdotL;\n' +
'void main() {\n' +
'  vec4 color0 = texture2D(Sampler0, TexCoord_var);\n' +
'  gl_FragColor = vec4(LightColor1 * color0.rgb * NdotL + AmbientLight1 * color0.rgb , color0.a);\n' +
'}\n';