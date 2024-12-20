import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"; // Import RGBELoader
import GUI from "lil-gui";
import testVertexShader from "./shaders/test/vertex.glsl";
import testFragmentShader from "./shaders/test/fragment.glsl";
import testFragmentShader2 from "./shaders/test/fragment2.glsl";
import { Group } from "three/examples/jsm/libs/tween.module.js";
/**
 * Base
 */
// Debug
const gui = new GUI();
// Loaders
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/little_paris_eiffel_tower_4k.hdr", (hdrEquirect) => {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envMap = pmremGenerator.fromEquirectangular(hdrEquirect).texture;

  // Set the environment map for scene and objects
  scene.background = envMap;
  scene.environment = envMap;

  // Optionally, free the HDR texture after conversion to save memory
  hdrEquirect.dispose();
});
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("/textures/flag-nepal.png");
const flagTexture2 = textureLoader.load(
  "/textures/flag-france.png",
  () => {
    console.log("Texture for French flag loaded successfully.");
  },
  undefined,
  (err) => {
    console.error("Error loading texture: ", err);
  }
);

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
const geometry2 = new THREE.PlaneGeometry(1, 1, 32, 32);
// in geometry we can check the attributes -> normal, position,uv
// poisition is the coordinates of the vertices + the number of subdivisions
// the normal is the outside of the vertices where we can interact with light and shadows ...
// the uv is the placement of texture, The 'U' and 'V' in UV mapping correspond to the axes of the 2D texture space
console.log(geometry);
// we can also add our own attributes

// provide random values and move vertices randomly
const count = geometry.attributes.position.count; // the exact count of sommets/vertices
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
  randoms[i] = Math.random();
}
console.log(randoms);

// we call it arandom below we say a for attribute v for varying and u for uniform
geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1)); // randoms is the float32array and how many entries at a time we take from the list
// Material
const material = new THREE.RawShaderMaterial({
  //Template Literals ` ` to write GLSL code
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  side: THREE.DoubleSide,
  //   wireframe: true,
  transparent: true,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(13, 3) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("orange") },
    uTexture: { value: flagTexture },
  },
});

// French Flag
const material2 = new THREE.RawShaderMaterial({
  //Template Literals ` ` to write GLSL code
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader2,
  side: THREE.DoubleSide,
  //   wireframe: true,
  transparent: true,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(-6, 3) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("orange") },
    uTexture2: { value: flagTexture2 },
    // uOffset: { value: new THREE.Vector3(1.5, 0, 0) }, // Offset for mesh2
  },
});
gui
  .add(material.uniforms.uFrequency.value, "x")
  .min(-20)
  .max(20)
  .step(0.01)
  .name("frequencyX");
gui
  .add(material.uniforms.uFrequency.value, "y")
  .min(-20)
  .max(20)
  .step(0.01)
  .name("frequencyY");
gui
  .add(material2.uniforms.uFrequency.value, "x")
  .min(-20)
  .max(20)
  .step(0.01)
  .name("frequencyX");
gui
  .add(material2.uniforms.uFrequency.value, "y")
  .min(-20)
  .max(20)
  .step(0.01)
  .name("frequencyY");
// Mesh
const mesh = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(geometry2, material2);
mesh.position.x += 1.15;
mesh2.position.x -= 1.15;

// Create a group to hold both meshes
const group = new THREE.Group();
group.add(mesh);
group.add(mesh2);
// group.rotation.x += 1;
// group.rotation.y += 1;
scene.add(group); // Add the group to the scene
group.scale.multiplyScalar(0.65);
// Expose the group rotation to the GUI
group.rotation.y = 420 / 100;
gui
  .add(group.rotation, "y", 0, Math.PI * 2, 0.01)
  .name("Model Rotation")
  .min(1)
  .max(4);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
// Camera
const camera = new THREE.PerspectiveCamera(
  115,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
scene.add(camera);

// Set initial rotation angle for the camera
let rotationAngle = 3.7; // Default rotation angle

// Calculate the camera's initial position based on the rotation angle
const radius = 1.5; // Distance from the center of the scene
camera.position.z = radius * Math.sin(rotationAngle);
camera.position.x = radius * Math.cos(rotationAngle);
camera.position.y += -0.25;
camera.lookAt(0, 0, 0); // Keep camera looking at the center of the scene
camera.rotation.y = 9;
gui
  .add(camera.rotation, "y", 0, Math.PI * 2)
  .name("Env Rotation")
  .onChange((value) => {
    // Adjust camera position as group rotates
    const radius = 1.5; // Distance of the camera from the center of the scene
    camera.position.x = radius * Math.cos(value);
    camera.position.z = radius * Math.sin(value);

    // Keep the camera looking at the center of the scene
    // camera.lookAt(0, 0, 0);
  })
  .min(6)
  .max(10);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Add a GUI control to rotate the camera and mesh together
// camera.rotation += 3.6;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update material
  material.uniforms.uTime.value = elapsedTime;
  material2.uniforms.uTime.value = elapsedTime + 0.5;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
