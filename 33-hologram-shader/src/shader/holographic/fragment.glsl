varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
uniform vec3 uColor;

void main() {
  // 归一化法向量
  vec3 normal = normalize(vNormal);
  if(!gl_FrontFacing) {
    normal *= - 1.0;
  }


  float stripes = pow(mod((vPosition.y - uTime * 0.02) * 20.0, 1.0), 3.0);

  vec3 viewDirection = normalize(vPosition - cameraPosition);
  float fresnel = pow(dot(viewDirection, normal) + 1.0, 2.0);
    // 边缘衰减
  float falloff = smoothstep(.8, .0, fresnel);

  // holographic 全系
  float holographic = stripes * fresnel;
  holographic += fresnel * 1.25;
  holographic *= falloff;

  
  gl_FragColor = vec4(uColor, holographic);

#include <colorspace_fragment>
#include <tonemapping_fragment>
}