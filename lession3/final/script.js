
import * as THREE from 'three'

// 画布
const canvas = document.querySelector('canvas.webgl')

// 场景
const scene = new THREE.Scene()
// 几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 材质
const material = new THREE.MeshBasicMaterial({ color: '#ff0000' })
// 网格
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//相机（视角范围， 高宽比）
const sizes = {
  width: 800,
  height: 600
}
const camera = new THREE.PerspectiveCamera(75, sizes.width/ sizes.height)
camera.position.z = 3
scene.add(camera)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)