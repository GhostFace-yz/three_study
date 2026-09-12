float directionalLight(vec3 normal, vec3 lightDirection, vec3 lightColor, vec3 LightIntensity) {
  float shading = dot(lightDirection, normal);
  shading = max(.0, shading);
  return shading;
}