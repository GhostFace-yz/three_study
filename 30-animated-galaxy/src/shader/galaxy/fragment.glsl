varying vec3 vColor;

void main() {

  // 点变圆
  // float strength = distance(gl_PointCoord, vec2(.5));
  // strength = step(.5, strength);
  // strength = 1.0 - strength;

  // 散开点
  // float strength = distance(gl_PointCoord, vec2(.5));
  // strength *= 2.0;
  // strength = 1.0 - strength;

  //
  float strength = distance(gl_PointCoord, vec2(.5));
  strength = 1.0 - strength;
  strength = pow(strength, 10.0);

  //最终颜色
  vec3 color = mix(vec3(0.0), vColor, strength);


  gl_FragColor = vec4(vec3(color), 1.0);
}