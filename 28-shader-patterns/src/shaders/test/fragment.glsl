#define PI 3.1415926535897932384

varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
  return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y);
}

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
  // float strength = mod(vUv.x * 10.0, 1.0);
  // strength = step(8., strength);

  // 图案11
  //  float strength = step(.8, mod(vUv.x * 10.0, 1.0));
  //  strength += step(.8, mod(vUv.y * 10.0, 1.0));
  // 图案12
  //   float strength = step(.8, mod(vUv.x * 10.0, 1.0));
  //   strength *= step(.8, mod(vUv.y * 10.0, 1.0));
  // 图案13
  // float strength = step(.8, mod(vUv.y * 10.0, 1.0));
  // strength *= step(.4, mod(vUv.x * 10.0, 1.0));
  // 图案14
  // float strength = step(.8, mod(vUv.y * 10.0, 1.0));
  // strength += step(.8, mod(vUv.x * 10.0, 1.0));
  // strength *= step(.4, mod(vUv.x * 10.0, 1.0));
  // strength *= step(.4, mod(vUv.y * 10.0, 1.0));

  // 图案15
  // float barX = step(.4, mod(vUv.x * 10.0, 1.0));
  // barX *= step(.8, mod(vUv.y * 10.0 + .2, 1.0));
  // float barY = step(.8, mod(vUv.x * 10.0 + .2, 1.0));
  // barY *= step(.4, mod(vUv.y * 10.0, 1.0));

  // float strength = barX + barY;

  // 图案16
  // float strength = abs(vUv.x - .5);
  // float strength = (x < 0.0? -x : x);

  // 图案17
  // float x = abs(vUv.x - .5);
  // float y = abs(vUv.y - .5);
  // float strength = min(x, y);

  // 图案18
  // float x = abs(vUv.x - .5);
  // float y = abs(vUv.y - .5);
  // float strength = max(x, y);

  // 图案19
  // float x = abs(vUv.x - .5);
  // float y = abs(vUv.y - .5);
  // float strength = step(.2, max(x, y));

  // 图案20
  // float x = abs(vUv.x - .5);
  // float y = abs(vUv.y - .5);
  // float strength = step(.4, max(x, y));

  // 图案21
  // float strength = floor(vUv.x * 10.0)  / 10.0;

  // 图案22
  // float strength = floor(vUv.x * 10.0)  / 10.0 * floor(vUv.y * 10.0)  / 10.0;

  // 图案23
  // float strength = random(vUv);

  // 图案24
  // vec2 gridUv = vec2(floor(vUv.x * 10.0)  / 10.0, floor(vUv.y * 10.0)
  // / 10.0); float strength = random(gridUv);

  // 图案25
  // vec2 gridUv = vec2(floor(vUv.x * 10.0)  / 10.0, floor((vUv.y + vUv.x * .5)
  // * 10.0)  / 10.0 ); float strength = random(gridUv);

  // 图案26
  // float strength = length(vUv);

  // 图案27
  // float strength = distance(vUv, vec2(.5, .5));

  // 图案28
  // float strength = abs(distance(vUv, vec2(.5, .5)) - 1.0 );

  // 图案29
  // float strength = .015 / distance(vUv, vec2(.5, .5)) + .2;

  // 图30
  // vec2 lightUv = vec2(vUv.x * .1 + .45, vUv.y * .5 + .25);
  // float strength = .015 / distance(lightUv, vec2(.5, .5));

  // 图31
  // vec2 lightUvX = vec2(vUv.x * .1 + .45, vUv.y * .5 + .25);
  // float lightX = .008 / distance(lightUvX, vec2(.5, .5));

  // vec2 lightUvY = vec2(vUv.y * .1 + .45, vUv.x * .5 + .25);
  // float lightY = .008 / distance(lightUvY, vec2(.5, .5));
  // float strength = lightY * lightX;

  // 图32
  // vec2 rotateUv = rotate(vUv, PI / 4.0, vec2(.5));

  // vec2 lightUvX = vec2(rotateUv.x * .1 + .45, rotateUv.y * .5 + .25);
  // float lightX = .015 / distance(lightUvX, vec2(.5, .5));

  // vec2 lightUvY = vec2(rotateUv.y * .1 + .45, rotateUv.x * .5 + .25);
  // float lightY = .015 / distance(lightUvY, vec2(.5, .5));
  // float strength = lightY * lightX;

  // 图33
  // float strength = step(.25, distance(vUv, vec2(.5)));

  // 图34
  // float strength = abs(distance(vUv, vec2(.5)) - .25);

  // 图35
  // float strength = step(.01, abs(distance(vUv, vec2(.5)) - .25));

  // 图36
  // float strength = 1.0 - step(.01, abs(distance(vUv, vec2(.5)) - .25));

  // 图37
  // vec2 waveUv = vec2(vUv.x, vUv.y + sin(vUv.x * 30.0) * .1);
  // float strength = 1.0 - step(.01, abs(distance(waveUv, vec2(.5)) - .25));

  // 图38
  // vec2 waveUv =
  //     vec2(vUv.x + sin(vUv.y * 30.0) * .1, vUv.y + sin(vUv.x * 30.0) * .1);

  // 图39
  // vec2 waveUv =
  //     vec2(vUv.x + sin(vUv.y * 100.0) * .1, vUv.y + sin(vUv.x * 100.0) * .1);
  // float strength = 1.0 - step(.01, abs(distance(waveUv, vec2(.5)) - .25));

  // 图40
  // float strength = rotate(vUv, PI * 1.75, vec2(.5)).x;
  // float strength = atan(vUv.x, vUv.y);

  // 图41
  // float strength = atan(vUv.x - .5, vUv.y - .5);
  
  // 图42
  // float angle = atan(vUv.x - .5, vUv.y - .5);
  // angle /= PI * 2.0;
  // angle += .5;
  // float strength = angle;
  
  // 图43
  // float angle = atan(vUv.x - .5, vUv.y - .5);
  // angle /= PI * 2.0;
  // angle += .5;
  // angle *= 20.0;
  // angle = mod(angle, 1.0);
  
  // 图44
  float angle = atan(vUv.x - .5, vUv.y - .5);
  angle /= PI * 2.0;
  angle += .5;
  

  float strength = sin(angle * 100.0);





  gl_FragColor = vec4(strength, strength, strength, 1.0);
}