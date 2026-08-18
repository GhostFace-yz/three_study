uniform float uSize;
uniform vec2 uResolution;
attribute float aSize;
uniform float uProgress;

#include ../utils/remap.glsl

void main() {
  vec3 newPosition = position;

  // 爆炸
  float explodingProgress = remap(uProgress, .0, .2, .0, 1.0);
  newPosition *= explodingProgress;

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  gl_PointSize = uSize * uResolution.y * aSize;
  gl_PointSize *= 1.0 / -viewPosition.z;
}