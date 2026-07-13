import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * DEBUG
 */
const gui = new GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * light
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

/**
 * 环境
 */
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/environmentMap/2k.hdr', (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping
    // 作为场景的背景显示出来
    scene.background = envMap
    // 给场景里所有材质提供环境光反射信息
    scene.environment = envMap
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * texture
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('./textures/matcaps/8.png')
const gradientTexture = textureLoader.load('./textures/gradients/5.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * materials
 */
// 基础材质 不需要光照,给它什么颜色/贴图就显示什么样,完全不考虑光影关系。就像给物体"贴了张纸",平平的,没有立体感。
// const materials = new THREE.MeshBasicMaterial()
// materials.map = doorColorTexture
// materials.color = new THREE.Color('green')
// materials.wireframe = true
// materials.transparent = true
// materials.opacity = .2
// materials.alphaMap = doorAlphaTexture 
// materials.side = THREE.DoubleSide


// 法线材质 会把物体表面每个点的法线方向(可以理解成"这个点朝向哪边")转换成颜色显示出来,所以你会看到五颜六色、类似"高糊渐变"的效果。
// const materials = new THREE.MeshNormalMaterial()
// materials.wireframe = true
// materials.flatShading = true

// 类似塑料的材质(根据相机朝向选取对应材质,所以光线对它没有用)
// const materials = new THREE.MeshMatcapMaterial()
// materials.matcap = matcapTexture

// 深度材质 根据物体离摄像机的远近来显示颜色——越近越白,越远越黑(具体范围由相机的near/far决定)。
// const materials = new THREE.MeshDepthMaterial()

// lambert材质(需要灯光的材质 这个材质会对场景中的灯光有反应,能表现出基础的明暗效果,是性能消耗最低的支持光照的材质。)
// const materials = new THREE.MeshLambertMaterial()

//MeshPhong材质(需要灯光的材质, 消耗高更细节，可以设置反射光)
// const materials = new THREE.MeshPhongMaterial()
// materials.shininess = 10
// materials.specular = new THREE.Color(0x1188ff)

// MeshToonMaterial(需要灯光的材质, 节省资源，动画风， 但会把光影离散化成几个色块,而不是平滑渐变,从而做出卡通/动漫风格的效果(类似赛璐璐渲染))
// const materials = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// materials.gradientMap = gradientTexture

// MeshStandardMaterial（需灯光， 最常用、最真实的材质,基于真实世界的物理光照规则(PBR)）
const materials = new THREE.MeshStandardMaterial()
//0是非金属(木头、塑料、布料),1是纯金属(不锈钢、黄金)
materials.metalness = 1
// 0是镜面般光滑,1是完全粗糙、无光泽
materials.roughness = 1
// 颜色贴图(基础颜色)
materials.map = doorColorTexture
// 模拟缝隙、凹陷处光线照不到、更暗的效果,让细节更立体
materials.aoMap = doorAmbientOcclusionTexture
materials.aoMapIntensity = 1
// 根据贴图的黑白值真实地移动顶点位置,做出凹凸不平的物理形状(不是视觉假象,是真的把网格顶点顶起来了),所以你门的geometry要有足够的细分数才有效果
materials.displacementMap = doorHeightTexture
materials.displacementScale = .1
// 让金属度/粗糙度按区域变化(比如门把手是金属,门板是木头,用一张图分别控制不同区域)
materials.metalnessMap = doorMetalnessTexture
materials.roughnessMap = doorRoughnessTexture
materials.normalMap = doorNormalTexture
materials.normalScale.set(.5, .5)
// 镂空模板
materials.transparent = true
materials.alphaMap = doorAlphaTexture

// gui.add(materials, 'metalness').min(0).max(1).step(.0001)
// gui.add(materials, 'roughness').min(0).max(1).step(.0001)

//MeshPhysicalMaterial （在Standard基础上,增加了几个"高级效果层",专门用来模拟一些特殊材质）
// const materials = new THREE.MeshPhysicalMaterial()
// materials.metalness = 0
// materials.roughness = 0
// materials.map = doorColorTexture
// materials.aoMap = doorAmbientOcclusionTexture
// materials.aoMapIntensity = 1
// materials.displacementMap = doorHeightTexture
// materials.displacementScale = .1
// materials.metalnessMap = doorMetalnessTexture
// materials.roughnessMap = doorRoughnessTexture
// materials.normalMap = doorNormalTexture
// materials.normalScale.set(.5, .5)
// materials.transparent = true
// materials.alphaMap = doorAlphaTexture

gui.add(materials, 'metalness').min(0).max(1).step(.0001)
gui.add(materials, 'roughness').min(0).max(1).step(.0001)

// Clearcoat（清漆)
// materials.clearcoat = 1
// materials.clearcoatRoughness = 0

// gui.add(materials, 'clearcoat').min(0).max(1).step(0.0001)
// gui.add(materials, 'clearcoatRoughness').min(0).max(1).step(0.0001)

// Sheen(绒毛)
// materials.sheen = 1
// materials.sheenRoughness = .25
// materials.sheenColor.set(1, 1, 1)

// gui.add(materials, 'sheen').min(0).max(1).step(.0001)
// gui.add(materials, 'sheenRoughness').min(0).max(1).step(.0001)
// gui.addColor(materials, 'sheenColor')

// Iridescence(虹彩效果)
// materials.iridescence = 1
// materials.iridescenceIOR = 1
// materials.iridescenceThicknessRange = [ 100, 800 ]

// gui.add(materials, 'iridescence').min(0).max(1).step(.0001)
// gui.add(materials, 'iridescenceIOR').min(1).max(2.333).step(.0001)
// gui.add(materials.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
// gui.add(materials.iridescenceThicknessRange, '1').min(1).max(1000).step(1)

/**
 * Transmission(透视效果)
 */
// materials.transmission = 1
//折射率 ior
// materials.ior = 1.5
// materials.thickness = .5
// gui.add(materials, 'transmission').min(0).max(1).step(.0001)
// gui.add(materials, 'ior').min(0).max(10).step(.0001)
// gui.add(materials, 'thickness').min(0).max(1).step(.0001)

/**
 * geometry
 */
const sphere = new THREE.SphereGeometry(.5, 64, 64)
const plane = new THREE.PlaneGeometry(1, 1, 100, 100)
const torus = new THREE.TorusGeometry(.3, .2, 64, 128)

const group = new THREE.Group()

scene.add(group)



const sphereMesh = new THREE.Mesh(sphere, materials)
sphereMesh.position.x = -1.5
const planeMesh = new THREE.Mesh(plane, materials)
const torusMesh = new THREE.Mesh(torus, materials)
torusMesh.position.x = 1.5

group.add(sphereMesh, planeMesh, torusMesh)


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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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