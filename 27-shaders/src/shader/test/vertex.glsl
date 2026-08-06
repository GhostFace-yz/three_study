// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// 模型信息
// uniform mat4 modelMatrix;

uniform vec2 uFrequency;
uniform float uTime;

// attribute vec2 uv;
varying vec2 vUv;
varying float vElevation;

// 模型的位置信息
// attribute vec3 position;
// attribute float aRandom;

// varying float vRandom;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * .1;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * .1;

  modelPosition.z += elevation;

  // modelPosition.z += sin(modelPosition.x * uFrequency.x + uTime) * .1;
  // modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * .1;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  vUv = uv;
  vElevation = elevation;
}