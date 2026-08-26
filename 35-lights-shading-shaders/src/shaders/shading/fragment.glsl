uniform vec3 uColor;

#include "../light/ambientLight.glsl"

#include "../light/directionalLight.glsl"

void main()
{
    vec3 color = uColor;

    //光线
    vec3 light = vec3(.0);
    // light += ambientLight(vec3(1.0), .02);
    light += directionalLight(vec3(1.0), .02);
    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}