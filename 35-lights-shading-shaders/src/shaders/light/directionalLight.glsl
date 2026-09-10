

vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection) {
  vec3 lightDirection = normalize(lightPosition);
  vec3 lightReflection = reflect(-lightDirection, normal);

  float shading = dot(normal, lightDirection);
  shading = max(.0, shading);

  float specular = -dot(lightReflection, viewDirection);
  // return lightColor * lightIntensity * shading;

  return vec3(specular);

}
