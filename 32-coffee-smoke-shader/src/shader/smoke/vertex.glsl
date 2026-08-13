varying vec2 vUv;
uniform float uTime;
uniform sampler2D uPerlinTexture;

vec2 rotate2D(vec2 value, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  mat2 m = mat2(c, s, -s, c);
  return m * value;
}

void main() {
  vec3 newPosition = position;
  //扭曲节点
  float angle = position.y;
  newPosition.xz = rotate2D(newPosition.xz, angle);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  vUv = uv;
}