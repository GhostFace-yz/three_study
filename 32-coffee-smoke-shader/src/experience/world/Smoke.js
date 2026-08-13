import * as THREE from 'three'
import coffeeSmokeVertexShader from '/shader/smoke/vertex.glsl'
import coffeeSmokeFragmentShader from '/shader/smoke/fragment.glsl'

export default class Smoke {
  constructor(experience) {
    this.experience = experience
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug
    this.time = this.experience.time
    if (this.debug.actions) {
      this.debugFolder = this.debug.ui.addFolder('烟雾')
    }
    this.perlinTexture = this.resources.items.perlinPic
    this.perlinTexture.wrapS = THREE.RepeatWrapping
    this.perlinTexture.wrapT = THREE.RepeatWrapping
    this.setGeometry()
    this.setMaterial()
  }

  setGeometry() {
    this.smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64)
    this.smokeGeometry.translate(0, .5, 0)
    this.smokeGeometry.scale(1.5, 6, 1.5)
  }
  setMaterial() {
    this.smokeMaterial = new THREE.ShaderMaterial({
      vertexShader: coffeeSmokeVertexShader,
      fragmentShader: coffeeSmokeFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uPerlinTexture: new THREE.Uniform(this.perlinTexture)
      },
      wireframe: true
    })
    this.smokeMesh = new THREE.Mesh(
      this.smokeGeometry,
      this.smokeMaterial
    )
    this.smokeMesh.position.y = 1.83
    this.scene.add(this.smokeMesh)
  }
  update() {
    this.smokeMaterial.uniforms.uTime.value = this.time.elapsed * .001
  }
}