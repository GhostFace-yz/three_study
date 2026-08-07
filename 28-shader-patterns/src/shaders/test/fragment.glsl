varying vec2 vUv;

void main() {
  // 图案3
  // float strength = vUv.x;

  // 图案4
  // float strength = vUv.y;

  // 图案5
  // float strength = 1.0 - vUv.y;

  // 图案6
  // float strength = vUv.y * 10.0;

  // 图案7
  // float strength = mod(vUv.y * 10.0, 1.0);

  // 图案8
  //   float strength = mod(vUv.y * 10.0, 1.0);
  //   strength = step(.5, strength);
  // 图案9
  //   float strength = mod(vUv.y * 10.0, 1.0);
  //   strength = step(.8, strength);
  // 图案10
  //   float strength = mod(vUv.x * 10.0, 1.0);
  //   strength = step(.8, strength);

  // 图案11
  float strength = mod(vUv.x * 10.0, 1.0)  mod(vUv.y * 10, 1.0);
  strength = step(.8, strength);

  gl_FragColor = vec4(strength, strength, strength, 1.0);
}