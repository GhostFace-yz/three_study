import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
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
 * 纹理
 */
const textureLoader = new THREE.TextureLoader()

// 地板
const floorAlphaTexture = textureLoader.load('floor/alpha.jpg')
const floorColorTexture = textureLoader.load('floor/textures/rocky_terrain_diff_1k.jpg')
const floorARMTexture = textureLoader.load('floor/textures/rocky_terrain_arm_1k.jpg')
const floorNormalTexture = textureLoader.load('floor/textures/rocky_terrain_nor_gl_1k.jpg')
const floorDisplaceTexture = textureLoader.load('floor/textures/rocky_terrain_disp_1k.jpg')
floorColorTexture.repeat.set(8,8)
floorARMTexture.repeat.set(8,8)
floorNormalTexture.repeat.set(8,8)
floorDisplaceTexture.repeat.set(8,8)
floorColorTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorDisplaceTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplaceTexture.wrapT = THREE.RepeatWrapping

floorColorTexture.colorSpace = THREE.SRGBColorSpace

// 墙面
const wallColorTexture = textureLoader.load('wall/mixed_brick_wall_1k/mixed_brick_wall_diff_1k.jpg')
const wallARMTexture = textureLoader.load('wall/mixed_brick_wall_1k/mixed_brick_wall_arm_1k.jpg')
const wallNormalTexture = textureLoader.load('wall/mixed_brick_wall_1k/mixed_brick_wall_nor_gl_1k.jpg')
wallColorTexture.repeat.set(2, 2)
wallARMTexture.repeat.set(2, 2)
wallNormalTexture.repeat.set(2, 2)
wallColorTexture.wrapS = THREE.RepeatWrapping
wallARMTexture.wrapS = THREE.RepeatWrapping
wallNormalTexture.wrapS = THREE.RepeatWrapping
wallColorTexture.wrapT = THREE.RepeatWrapping
wallARMTexture.wrapT = THREE.RepeatWrapping
wallNormalTexture.wrapT = THREE.RepeatWrapping

wallColorTexture.colorSpace = THREE.SRGBColorSpace

// 房顶
const roofColorTexture = textureLoader.load('roof/textures/thatch_roof_angled_diff_1k.jpg')
const roofARMTexture = textureLoader.load('roof/textures/thatch_roof_angled_arm_1k.jpg')
const roofNormalTexture = textureLoader.load('roof/textures/thatch_roof_angled_nor_gl_1k.jpg')

roofColorTexture.repeat.set(3, 1)
roofARMTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)
roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping

roofColorTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map:floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplaceTexture,
    displacementScale: .3,
    displacementBias: - .118
  })
)
scene.add(floor)
floor.rotation.x = - Math.PI * .5

floor.position.rotation = Math.PI * .5

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floorDisplacementBias')
/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

// walls
const wallsSize = {
  width: 4,
  height: 2.5,
  depth: 4
}
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(wallsSize.width, wallsSize.height, wallsSize.depth),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture
  })
)
walls.position.y += wallsSize.height / 2
house.add(walls)

// roof
const roofSize = {
  radius: 3.5,
  height: 1.5,
  radialSegments: 4
}

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(roofSize.radius, roofSize.height, roofSize.radialSegments),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture
  })
)
roof.position.y += (2.5 + roofSize.height / 2)
roof.rotation.y = Math.PI * .25
house.add(roof)

// door
const doorParams = {
  width: 2.2,
  height: 2.2,
  widthSegments: 8,
  heightSegments: 8
}
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorParams.width, doorParams.height, doorParams.widthSegments, doorParams.heightSegments),
  new THREE.MeshStandardMaterial()
)
door.position.y += 1
door.position.z += wallsSize.width / 2 + .001
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial()
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(.5, .5, .5)
bush1.position.set(.8, .2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(.25, .25, .25)
bush2.position.set(1.4, .1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(.4, .4, .4)
bush3.position.set(-.8, .1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(.15, .15, .15)
bush4.position.set(-1, .05, 2.6)

house.add(bush1, bush2, bush3, bush4)

// 墓碑
const graveGeometry = new THREE.BoxGeometry(.6, .8, .2)
const graveMaterial = new THREE.MeshStandardMaterial()

const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 30; i++) {
  const angle = Math.PI * 2 * Math.random()
  const radius = 3 + Math.random() * 4
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.position.x = x
  grave.position.y = Math.random() * .4
  grave.position.z = z
  grave.rotation.x = (Math.random() - .5) * .4
  grave.rotation.y = (Math.random() - .5) * .4
  grave.rotation.z = (Math.random() - .5) * .4
  graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
const timer = new Timer()

const tick = () => {
  // Timer
  timer.update()
  const elapsedTime = timer.getElapsed()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()