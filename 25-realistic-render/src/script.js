import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

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
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh) {
      // Activate shadow here
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

/**
 * Environment map
 */
// Intensity
scene.environmentIntensity = 1
gui
  .add(scene, 'environmentIntensity')
  .min(0)
  .max(10)
  .step(0.001)

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.environment = environmentMap
})


// 平行光
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(-4, 6.5, 2.5)
scene.add(directionalLight)
gui.add(directionalLight, 'intensity').min(0).max(10).step(.001).name('平行光')
gui.add(directionalLight.position, 'x').min(-10).max(10).step(.001).name('平行光x')
gui.add(directionalLight.position, 'z').min(-10).max(10).step(.001).name('平行光z')
gui.add(directionalLight.position, 'y').min(-10).max(10).step(.001).name('平行光y')

// 阴影
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = .027
directionalLight.shadow.bias = -.004
directionalLight.shadow.mapSize.set(512, 512)
gui.add(directionalLight, 'castShadow')

// 阴影的法线偏差
gui.add(directionalLight.shadow, 'normalBias').min(-.05).max(.05).step(.001)
// 阴影偏差
gui.add(directionalLight.shadow, 'bias').min(-.05).max(.05).step(.001)

// helper
// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)
// 更新光源矩阵
directionalLight.target.position.set(0, 4, 0)
directionalLight.target.updateWorldMatrix()

// 纹理加载器
const textureLoader = new THREE.TextureLoader()

/**
 * Models
 */
// Helmet
// gltfLoader.load(
//   '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//   (gltf) => {
//     gltf.scene.scale.set(10, 10, 10)
//     scene.add(gltf.scene)

//     updateAllMaterials()
//   }
// )

gltfLoader.load(
  'models/hamburger.glb', (gltf) => {
    console.log(gltf);
    gltf.scene.scale.set(.5, .5, .5)
    gltf.scene.position.y = 2
    scene.add(gltf.scene)
  }
)


// 墙面
const wallColorTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg')
const wallARMTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg')
const wallNormalTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png')
wallColorTexture.colorSpace = THREE.SRGBColorSpace

const wall = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    normalMap: wallNormalTexture,
    metalnessMap: wallARMTexture,
    roughnessMap: wallARMTexture,
  })
)
wall.position.set(0, 4, -4)
scene.add(wall)

// 地板
const floorColorTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg')
const floorARMTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg')
const floorNormalTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png')
floorColorTexture.colorSpace = THREE.SRGBColorSpace

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    roughnessMap: floorARMTexture,
    aoMap: floorARMTexture
  })
)
floor.rotation.set(Math.PI * 1.5, 0, 0)
scene.add(floor)

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
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  // 抗锯齿（多重采样）
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// 阴影
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap


// 色调映射
renderer.toneMapping = THREE.ReinhardToneMapping
// 曝光
renderer.toneMappingExposure = 3

gui.add(renderer, 'toneMapping', {
  No: THREE.NoToneMapping,
  linear: THREE.LinearToneMapping,
  ReinHard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping
})

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(.001)

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()