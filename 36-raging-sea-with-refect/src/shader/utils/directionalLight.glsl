vec3 directionalLight(vec3 normal, vec3 viewDirection, vec3 lightColor, float lightIntensity,float specularPower ,vec3 lightPosition) {
  vec3 lightDirection = normalize(lightPosition);
  vec3 lightReflection = reflect(-lightDirection, normal);
  
  float shading = dot(lightDirection, normal);
  shading = max(.0, shading);

  float specular = dot(lightReflection, - viewDirection);
  specular = max(.0, specular);
  specular = pow(specular, specularPower);

  return lightColor* lightIntensity* (shading+ specular);
}