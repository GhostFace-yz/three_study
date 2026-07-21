import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import { Sky } from 'three/addons/objects/Sky.js'

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
const floorAlphaTexture = textureLoader.load('floor/alpha.webp')
const floorColorTexture = textureLoader.load('floor/textures/rocky_terrain_diff_1k.webp')
const floorARMTexture = textureLoader.load('floor/textures/rocky_terrain_arm_1k.webp')
const floorNormalTexture = textureLoader.load('floor/textures/rocky_terrain_nor_gl_1k.webp')
const floorDisplaceTexture = textureLoader.load('floor/textures/rocky_terrain_disp_1k.webp')
floorColorTexture.repeat.set(8, 8)
floorARMTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)
floorDisplaceTexture.repeat.set(8, 8)
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

// 树叶
const leavesColorTexture = textureLoader.load('leaves/textures/forest_leaves_03_diff_1k.webp')
const leavesARMTexture = textureLoader.load('leaves/textures/forest_leaves_03_arm_1k.webp')
const leavesNormalTexture = textureLoader.load('leaves/textures/forest_leaves_03_nor_gl_1k.webp')

leavesColorTexture.repeat.set(2, 1)
leavesARMTexture.repeat.set(2, 1)
leavesNormalTexture.repeat.set(2, 1)
leavesColorTexture.wrapS = THREE.RepeatWrapping
leavesARMTexture.wrapS = THREE.RepeatWrapping
leavesNormalTexture.wrapS = THREE.RepeatWrapping

leavesColorTexture.colorSpace = THREE.SRGBColorSpace

// 墓碑
const graveColorTexture = textureLoader.load('grave/textures/dark_rock_02_diff_1k.jpg')
const graveNormalTexture = textureLoader.load('grave/textures/dark_rock_02_nor_gl_1k.jpg')
const graveARMTexture = textureLoader.load('grave/textures/dark_rock_02_arm_1k.jpg')
graveColorTexture.colorSpace = THREE.SRGBColorSpace
graveColorTexture.repeat.set(.3, .4)
graveARMTexture.repeat.set(.3, .4)
graveNormalTexture.repeat.set(.3, .4)

// 门
const doorColorTexture = textureLoader.load('door/color.webp')
const doorAlphaTexture = textureLoader.load('door/alpha.webp')
const doorAmbientTexture = textureLoader.load('door/ambientOcclusion.webp')
const doorHeightTexture = textureLoader.load('door/height.webp')
const doorNormalTexture = textureLoader.load('door/normal.webp')
const doorMetalnessTexture = textureLoader.load('door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('door/roughness.webp')
doorColorTexture.colorSpace = THREE.SRGBColorSpace


/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
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
  new THREE.BoxGeometry(wallsSize.width, wallsSize.height, wallsSize.depth, 100, 1, 100),
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
  widthSegments: 100,
  heightSegments: 100
}
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorParams.width, doorParams.height, doorParams.widthSegments, doorParams.heightSegments),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientTexture,
    displacementMap: doorHeightTexture,
    displacementScale: .15,
    displacementBias: -.04,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture
  })
)
door.position.y += 1
door.position.z += wallsSize.width / 2 + .001
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
  color: '#ccff00',
  map: leavesColorTexture,
  aoMap: leavesARMTexture,
  roughnessMap: leavesARMTexture,
  metalnessMap: leavesARMTexture,
  normalMap: leavesNormalTexture
})
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(.5, .5, .5)
bush1.position.set(.8, .2, 2.2)
bush1.rotation.x = -.75

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(.25, .25, .25)
bush2.position.set(1.4, .1, 2.1)
bush2.rotation.x = -.75

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(.4, .4, .4)
bush3.position.set(-.8, .1, 2.2)
bush3.rotation.x = -.75

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(.15, .15, .15)
bush4.position.set(-1, .05, 2.6)
bush4.rotation.x = -.75

house.add(bush1, bush2, bush3, bush4)

// 墓碑
const graveGeometry = new THREE.BoxGeometry(.6, .8, .2, 4, 1, 4)
const graveMaterial = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  map: graveColorTexture,
  aoMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  normalMap: graveNormalTexture
})

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
const ambientLight = new THREE.AmbientLight('#86cdff', 1.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 10)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// 门灯
const doorLight = new THREE.PointLight('#ff7d46', 2)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)


/**
 * 鬼魂
 */
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)

scene.add(ghost1, ghost2, ghost3)



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
 * 阴影
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true

for (const grave of graves.children) {
  grave.castShadow = true
  grave.receiveShadow = true
}

// 天空背景
const sky = new Sky()
sky.scale.set(100, 100, 100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = .1
sky.material.uniforms['mieDirectionalG'].value = .95
sky.material.uniforms['sunPosition'].value.set(.3, -.038, -.95)

// 雾气
// scene.fog = new THREE.Fog('#ff0000', 1, 13)
scene.fog = new THREE.FogExp2('#03343f', .1)


// Mapping
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

/**
 * Animate
 */
const timer = new Timer()

const tick = () => {
  // Timer
  timer.update()
  const elapsedTime = timer.getElapsed()

  // 鬼魂
  const ghost1Angle = elapsedTime * .5
  ghost1.position.set(
    Math.cos(ghost1Angle) * 4,
    Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45),
    Math.sin(ghost1Angle) * 4
  )

  const ghost2Angle = - elapsedTime * .3
  ghost2.position.set(
    Math.cos(ghost2Angle) * 5,
    Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45),
    Math.sin(ghost2Angle) * 5
  )

  const ghost3Angle = - elapsedTime * .2
  ghost3.position.set(
    Math.cos(ghost3Angle) * 6,
    Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45),
    Math.sin(ghost3Angle) * 6
  )


  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()