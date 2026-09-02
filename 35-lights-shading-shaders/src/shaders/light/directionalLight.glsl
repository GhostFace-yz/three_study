

vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition) {
  vec3 lightDirection = normalize(lightPosition);

  float shading = dot(normal, lightDirection);
  shading = max(.0, shading);
  return lightColor * lightIntensity * shading;
}
