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
 * 银河
 */
const parameters = {
  count: 100000,
  size: .01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: .2,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
  randomnessPower: 3
}

let geometry = null
let material = null
let points = null

const initGalaxy = () => {
  if (points) {
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }
  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)
  const colorInside = new THREE.Color(parameters.insideColor)
  const colorOutside = new THREE.Color(parameters.outsideColor)
  geometry = new THREE.BufferGeometry()
  for (let index = 0; index < parameters.count; index++) {
    const i3 = index * 3
    const radius = Math.random() * parameters.radius
    // 自旋角度
    const spinAngle = radius * parameters.spin
    // 分角度
    const branchAngle = (index % parameters.branches) / parameters.branches * Math.PI * 2

    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1)
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1)
    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1)

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[i3 + 1] = 0 + randomY
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / parameters.radius)

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  })
  points = new THREE.Points(
    geometry,
    material
  )
  scene.add(points)
}
initGalaxy()
gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(initGalaxy)
gui.add(parameters, 'size').min(.001).max(.1).step(.001).onFinishChange(initGalaxy)
gui.add(parameters, 'radius').min(.01).max(20).step(.01).onFinishChange(initGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(initGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(.001).onFinishChange(initGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(.001).onFinishChange(initGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(.001).onFinishChange(initGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(1).onFinishChange(initGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(initGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(initGalaxy)

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
camera.position.x = 3
camera.position.y = 3
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

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()