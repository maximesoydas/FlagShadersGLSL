
/** GLSL Language

** Documentation **
Shaderific
Kronos Group registery // OpenGL doc
Book of shaders glossary //

Many built in classic functions :
 sin, cos, max, min, pow, exp, mod, clamp
And more practical functions like
 cross, dot, mix, step, smoothstep, length, distance, reflect, refract, normalize

** Vertex Shader.glsl **
void main() -> needs to be written and it will be called automatically by the gpu,
it does not return anything hence why it does not have a return and is a void type fucntion

gl_position -> already exists by default, it will contain position of the vertex on the screen
*/

// functions

// float loremIpsum()// can also take argument like, (float a, float b)
// {
//     float a = 1.0;
//     float b = 2.0;

//     return a + b;
// }
 // float result = loremIpsum(1.0,1.0); // call the float function like this
    // float 
    // float a = 1.0;
    // float b = 2.0;
    // float c = a + b;

    // integer
    // int a = 1;
    // int b = 2;
    // int c = a * b;

    // Maths operations (convert int to float)

    // float a = 1.0;
    // int b = 2;
    // float c = a * float(b);

    // Boolean
    // bool foo = true;
    // bool bar = false;

    // vector 2
    // vec2 foo = vec2(1.0,-2.0); // 2D coordinates cant be empty, can use 1 value if both values have to be the same
    // foo.x = 1.0; // can change x and y positions of the vec2
    // foo.y = 2.0;
    // foo*=2.0 // multiply all x and y values by 2
    
    // // vector 3
    // // x y b (aliases both work)
    // vec3 foo = vec3(0.0);
    // vec3 bar = vec3(1.0,2.0,3.0); 
    // bar.z = 4.0;
    // // r g b (aliases both works)
    // vec3 purpleColor = vec3(0.0);
    // purpleColor.g = 0.5;
    // purpleColor.b = 1.0;

    // // Vector 3 from Vector 2
    // vec2 foo = vec2(1.0,2.0);
    // vec3 bar = vec3(foo,3.0);
    // // better way
    // vec3 foo2 = vec3(1.0,2.0,3.0);
    // vec2 bar2 = foo2.xz; //swizzle

    // // Vector 4
    // vec4 foo = vec4(1.0,2.0,3.0,4.0);
    // float bar = foo.w; // a or w is the same a for color rgba or xyzw

    // Others too , mat1/2/3/4 for matrices or sampled2d

/* Matrices Uniforms */
// Each matrix will transform the position in order to position the vertex inside our render (clipspace)
// mat4 for vec4
// to apply a matrix on a position
// uniforms because they are the same for all the vertices
// each matrix will do a part of the transformation
// to apply a matrix we multiply it so that the coordinates get somewhere
// 3 matrices model, view and projection MVP

// specific to 3js
uniform mat4 modelMatrix; // Apply transformation relative to the Mesh (position, rotation, scale)
uniform mat4 viewMatrix; // Apply transformations relative to the Camera
// Model and view can be combined using model view
// uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;  // Apply Width, Tranform the coordinates into the final clip space coordinates
uniform vec2 uFrequency;
uniform float uTime;




// attributes
attribute vec3 position; // get values of each vertex from the position attribute
attribute vec2 uv;

// to retrieve attribute custom value
// attribute float aRandom;
varying vec2 vUv;
varying float vElevation;
// varying float vRandom; // create the varying to transfer the attributes into varying to fragment.glsl

//  if the function doesnt return anything its named void
void main()
{

    // vRandom = aRandom;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.y += 1.0;
    float elevation = sin(modelPosition.x*uFrequency.x - uTime) * 0.1; 
    elevation += sin(modelPosition.y*uFrequency.y - uTime) * 0.1;

    modelPosition.z += elevation;
    // modelPosition.x += 1.0;
   

    // modelPosition.y *= 0.35;
    // modelPosition += aRandom * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    // GL POSITION  is in 4D xyzw and works as a clip space, more than the positions we need to know the depth (z) and perspective (w)
    // Clipspace looks like a square that holds the camera, the depth and the positions of the vertex + the z to get the depth.
    //  to go further there is a perspective and homogenous coordinates. this would explain the 4th dimension 4D - w
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); // here we convert positions to vec4 by adding w = 1.0 and the positions
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // here we convert positions to vec4 by adding w = 1.0 and the positions
    vUv = uv;
    vElevation = elevation;



}

