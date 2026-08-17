uniform sampler2D uTexture;
uniform vec3 uColor;

void main() {
  float textureColorAlpha = texture(uTexture, gl_PointCoord).r;


  gl_FragColor = vec4(uColor, textureColorAlpha);
#include <colorspace_fragment>
#include <tonemapping_fragment>
}