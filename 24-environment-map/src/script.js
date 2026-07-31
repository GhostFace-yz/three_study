import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'
import { GroundedSkybox } from 'three/examples/jsm/objects/GroundedSkybox.js'

/**
 * Base
 */
// Debug
const gui = new GUI()
const global = {
  envMapIntensity: .5,
  envBlurriness: .08,
  backgroundIntensity: 5
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


gui.add(scene, 'environmentIntensity').min(0).max(10).step(.1)
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(.01)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(.1)

// 加载器
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
const rgbeLoader = new RGBELoader()
const exrLoader = new EXRLoader()
const textureLoader = new THREE.TextureLoader()
// 环境加载器（正方体）
const cubeTextureLoader = new THREE.CubeTextureLoader()
// 环境贴图
// const environmentMap = cubeTextureLoader.load([
//   'environmentMaps/0/px.png',
//   'environmentMaps/0/nx.png',
//   'environmentMaps/0/py.png',
//   'environmentMaps/0/ny.png',
//   'environmentMaps/0/pz.png',
//   'environmentMaps/0/nz.png',
// ])

// const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/digital_painting_neon_city_night_orange_lights_.jpg')
// environmentMap.colorSpace = THREE.SRGBColorSpace
// environmentMap.mapping = THREE.EquirectangularReflectionMapping
//全景照片背景
// exrLoader.load('/environmentMaps/nvidiaCanvas-4k.exr', (envMap) => {
//   console.log(envMap);
//   envMap.mapping = THREE.EquirectangularReflectionMapping
//   scene.background = envMap
//   scene.environment = envMap
// })

// scene.background = environmentMap
// scene.environment = environmentMap

// const skyboxParams = {
//   height: 15,
//   radius: 70
// }

// let skyBox = null

// rgbeLoader.load('/environmentMaps/2/2k.hdr', (envMap) => {
//   envMap.mapping = THREE.EquirectangularReflectionMapping
//   scene.environment = envMap
//   // 天空盒
//   skyBox = new GroundedSkybox(envMap, skyboxParams.height, skyboxParams.radius)
//   skyBox.position.y = skyboxParams.height
//   scene.add(skyBox)

//   gui.add(skyboxParams, 'radius', 1, 200, .1).name('skyBoxRadius').onFinishChange(rebuildSkybox)
//   gui.add(skyboxParams, 'height', 1, 100, .1).name('skyBoxHeight').onFinishChange(rebuildSkybox)

//   function rebuildSkybox() {
//     scene.remove(skyBox)
//     skyBox.geometry.dispose()
//     skyBox = new GroundedSkybox(envMap, skyboxParams.height, skyboxParams.radius)
//     skyBox.position.y = skyboxParams.height
//     scene.add(skyBox)
//   }
// })


/**
 * 实时环境
 */
const envMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg')
envMap.mapping = THREE.EquirectangularReflectionMapping
envMap.colorSpace = THREE.SRGBColorSpace

scene.background = envMap
// scene.environment = envMap

// 神圣光圈
const holyDonut = new THREE.Mesh(
  new THREE.TorusGeometry(8, .5),
  new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) })
)

holyDonut.position.y = 3.5
holyDonut.layers.enable(1)
scene.add(holyDonut)

// 渲染纹理背景
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  type: THREE.HalfFloatType
})
scene.environment = cubeRenderTarget.texture

// 特殊正方体相机
const cubeCamera = new THREE.CubeCamera(.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1)

// 材料光照
scene.environmentIntensity = 1
// 环境分辨率
scene.backgroundBlurriness = .00
// 环境亮度
scene.backgroundIntensity = 1



dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * 模型
 */
gltfLoader.load(
  '/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    gltf.scene.scale.set(10, 10, 10)
    scene.add(gltf.scene)
  }
)

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: .1,
    metalness: 1,
    color: '#ffffff'
  })
)
torusKnot.position.y = 4
torusKnot.position.x = -4
scene.add(torusKnot)

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
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime()

  // 
  if (holyDonut) {
    holyDonut.rotation.x = Math.sin(elapsedTime) * 2

    cubeCamera.update(renderer, scene)
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()