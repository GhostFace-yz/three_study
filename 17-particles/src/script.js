import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const starTexture = textureLoader.load('/textures/particles/2.png')

/**
 * 粒子
 */
const particleGeometry = new THREE.BufferGeometry()
const count = 20000

const position = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
  position[i] = (Math.random() - .5) * 10
  colors[i] = Math.random()
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particlesMaterial = new THREE.PointsMaterial({
  size: .1,
  sizeAttenuation: true,//相机远近例子大小不同
  transparent: true,
  alphaMap: starTexture,
  color: '#ffaa99',
  // alphaTest: .001,
  // depthTest: false
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true
})
const particles = new THREE.Points(particleGeometry, particlesMaterial)
scene.add(particles)

// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(2, 2, 2),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // 动画
  // particles.rotation.y = elapsedTime* .2
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const x = particleGeometry.attributes.position.array[i3]
    particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
  }
  particleGeometry.attributes.position.needsUpdate = true
  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()