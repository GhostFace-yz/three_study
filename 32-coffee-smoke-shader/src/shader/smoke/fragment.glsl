uniform float uTime;

varying vec2 vUv;

uniform sampler2D uPerlinTexture;

void main() {

  // 缩放和动画
  vec2 smokeUv = vUv;
  smokeUv.x *= .5;
  smokeUv.y *= .3;
  smokeUv.y -= uTime * .03;

  // 烟雾
  float smoke = texture(uPerlinTexture, smokeUv).r;

  smoke = smoothstep(.4, 1.0, smoke);

  smoke *= smoothstep(.0, .1, vUv.x);
  smoke *= smoothstep(1.0, .9, vUv.x);
  smoke *= smoothstep(1.0, .4, vUv.y);
  smoke *= smoothstep(.0, .1, vUv.y);



  gl_FragColor = vec4(.6, .3, .2, smoke);
  // gl_FragColor = vec4(1.0, .0, .0, 1.0);

// 着色器支持色彩映射
#include <colorspace_fragment>
#include <tonemapping_fragment>
}