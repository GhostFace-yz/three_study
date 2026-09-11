uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include "../light/ambientLight.glsl"

#include "../light/directionalLight.glsl"

void main()
{
    vec3 normal = normalize(vNormal);
    // 视线
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    vec3 color = uColor;

    //光线
    vec3 light = vec3(.0);
    light += ambientLight(vec3(1.0), 0.01);
    light += directionalLight(
        vec3(.1, .1, 1.0),
        1.0,
        normal, 
        vec3(.0, .0, 3.0),
        viewDirection,
        20.0
        );
    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}