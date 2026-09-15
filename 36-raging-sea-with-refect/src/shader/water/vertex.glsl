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
varying vec3 vPosition;

#include "../utils/perlinClassic3D.glsl"

//	Classic Perlin 3D Noise
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//

float waveElevation(vec3 position) {
 float elevation =
      sin(position.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
      sin(position.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
      uBigWavesElevation;

  for (float i = 1.0; i <= uSmallWavesIterations; i++) {
    elevation -= abs(perlinClassic3D(vec3(position.xz * uSmallWavesFrequency * i,
                                 uTime * uSmallWavesSpeed)) *
                     uSmallWavesElevation / i);
  }
  return elevation;
}


void main() {
  float shift = .02;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec3 modelPositionA = modelPosition.xyz + vec3(shift, .0, .0);
  vec3 modelPositionB = modelPosition.xyz + vec3(.0, .0, -shift);

  float elevation = waveElevation(modelPosition.xyz); 

  modelPosition.y += elevation;
  modelPositionA.y += waveElevation(modelPositionA);
  modelPositionB.y += waveElevation(modelPositionB);


  //计算法线
  vec3 toA = normalize(modelPositionA - modelPosition.xyz);
  vec3 toB = normalize(modelPositionB - modelPosition.xyz);
  vec3 computeNormal = cross(toA, toB);


  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // varying
  vElevation = elevation;

  vec4 modelNormal = modelMatrix * vec4(normal, .0);
  vNormal = computeNormal;
  vPosition = modelPosition.xyz;
}
