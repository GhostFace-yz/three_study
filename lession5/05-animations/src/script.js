import * as THREE from 'three'
import gsap from 'gsap'

console.log(gsap);

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
	width: 800,
	height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)


gsap.to(mesh.position, {duration: 1,  delay: 1, x: 2 })
gsap.to(mesh.position, {duration: 1,  delay: 2, x: 0 })
// 动画
// 方法1
// let time = Date.now()
// const tick = () => {
// 	const currentTime = Date.now()
// 	const deltaTime = currentTime - time 
// 	time = currentTime
	
// 	mesh.rotation.y += .001 * deltaTime
// 	renderer.render(scene, camera)
// 	window.requestAnimationFrame(tick)
// }

// 方法2
const clock = new THREE.Clock()
const tick = () => {
	// const elapsedTime = clock.getElapsedTime()
	
	// camera.position.y = Math.sin(elapsedTime)
	// camera.position.x = Math.cos(elapsedTime)
	// camera.lookAt(mesh.position)
	renderer.render(scene, camera)
	window.requestAnimationFrame(tick)
}
tick()