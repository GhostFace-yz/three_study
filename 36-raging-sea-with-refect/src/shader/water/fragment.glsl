uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec3 vNormal;

#include "../utils/ambientLight.glsl"
#include "../utils/directionalLight.glsl"

void main() {
  vec3 normal = normalize(vNormal);
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  mixStrength = smoothstep(.1, 1.0, mixStrength);
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

  vec3 light = vec3(.0);
  light += ambientLight(vec3(1.0), .2);
  light += directionalLight(normal, vec3(1.0));
  color *= light;
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}