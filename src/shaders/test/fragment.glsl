/* Fragment Shader */

// Void main returns nothing, is called automatically -> void type
// precision of the float depending on the values (for example tiny zoom)
// need to decide on how precise is the float 0.1 or 0.00000001 
// highp, mediump, lowp as precision increases performance decreases , lowp might trigger bugs as its not very precise
// this precision is handled automatically by threejs when using the class ShaderMaterial
precision mediump float; //good enough precision for all devices 
uniform vec3 uColor;
uniform sampler2D uTexture;
uniform sampler2D uTexture2;
varying vec2 vUv;
varying float vElevation;
// varying float vRandom; // get attributes from script.js through varying applied in vertex.glsl
void main()
{
// gl_FragColor = vec4(vRandom,vRandom*1.2,1.0,1); // RGB Alpha
vec4 textureColor = texture2D(uTexture, vUv);
textureColor.rgb *= vElevation *0.2 +  0.90; 
// gl_FragColor = vec4(uColor,1.0); // RGB Alpha
gl_FragColor = textureColor; // RGB Alpha
}
