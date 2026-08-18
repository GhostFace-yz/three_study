uniform float uSize;
uniform vec2 uResolution;
attribute float aSize;
attribute float aTimeMultiplier;
uniform float uProgress;

#include "../utils/remap.glsl"

void main() {
  float progress = uProgress * aTimeMultiplier;


  vec3 newPosition = position;

  // 爆炸
  float explodingProgress = remap(progress, .0, .1, .0, 1.0);
  explodingProgress = clamp(explodingProgress, .0, 1.0);
  explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);

  // 下坠
  float fallingProgress = remap(progress, .1, 1.0, .0, 1.0);
  fallingProgress = clamp(fallingProgress, .0, 1.0);
  fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);

  // 尺寸
  float sizeOpeningProgress = remap(progress, .0, .125, .0, 1.0);
  float sizeClosingProgress = remap(progress, .125, 1.0, 1.0, .0);
  float sizeProgress = min(sizeOpeningProgress, sizeClosingProgress);
  sizeProgress = clamp(sizeProgress, .0, 1.0);

  // 闪烁
  float twinklingProgress = remap(progress, .2, .8, .0, 1.0);
  twinklingProgress = clamp(twinklingProgress, .0, 1.0);
  float sizeTwinkling = sin(progress * 30.0) * .5 + .5;
  sizeTwinkling = 1.0 - sizeTwinkling * twinklingProgress;

  newPosition *= explodingProgress;
  newPosition.y -= fallingProgress;

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkling;
  gl_PointSize *= 1.0 / -viewPosition.z;

  if(gl_PointSize < 1.0) {
    gl_Position = vec4(9999.9);
  }
}