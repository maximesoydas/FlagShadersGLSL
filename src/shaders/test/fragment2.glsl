/* Fragment Shader 2 */

precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture2;
varying vec2 vUv;
varying float vElevation;

void main()
{
    // Sample the second texture
    vec4 textureColor = texture2D(uTexture2, vUv);

    // Apply elevation effect (optional)
    textureColor.rgb *= vElevation * 0.2 + 0.90;

    // Set the final color output
    gl_FragColor = textureColor; // Output the color from the second texture
}
