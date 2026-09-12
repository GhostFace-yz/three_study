uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesIterations;
uniform float uSmallWavesSpeed;

varying float vElevation;
varying vec3 vNormal;

#include "../utils/perlinClassic3D.glsl"

//	Classic Perlin 3D Noise
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation =
      sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
      sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
      uBigWavesElevation;

  for (float i = 1.0; i <= uSmallWavesIterations; i++) {
    elevation -= abs(perlinClassic3D(vec3(modelPosition.xz * uSmallWavesFrequency * i,
                                 uTime * uSmallWavesSpeed)) *
                     uSmallWavesElevation / i);
  }

  modelPosition.y += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // varying
  vElevation = elevation;

  vec4 modelNormal = modelMatrix * vec4(normal, .0);
  vNormal = modelNormal.xyz;
}
