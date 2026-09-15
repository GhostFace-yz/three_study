uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include "../utils/ambientLight.glsl"
#include "../utils/directionalLight.glsl"
#include "../utils/pointLight.glsl"

void main() {
  vec3 normal = normalize(vNormal);
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  mixStrength = smoothstep(.1, 1.0, mixStrength);
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

  vec3 viewDirection = normalize(vPosition - cameraPosition);

  vec3 light = vec3(.0);
  // light += ambientLight(vec3(1.0), .2);
  // light += directionalLight(
  // normal,               // 法线
  // viewDirection,         // 视线位置      
  // vec3(1.0),            // 光线颜色
  // 1.0,                  // 强度
  // 30.0,                 // 反射强度
  // vec3(-1.0, .5, .0)   // 光线方向  
  // );
  light += pointLight(
    vec3(1.0),
    10.0,
    normal,
    vec3(.0, .25, .0),
    viewDirection,
    30.0,
    vPosition,
    .95
  );

  color *= light;
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}