import * as THREE from 'three'

/**
 * 球体：只管理自己的几何体和网格，材质是外部注入的共享 halftone 材质。
 */
export default class Sphere {
  constructor(experience, halftoneMaterial) {
    this.experience = experience
    this.scene = experience.scene
    this.time = experience.time
    this.halftoneMaterial = halftoneMaterial

    this.setGeometry()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry()
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.halftoneMaterial.instance)
    this.mesh.position.x = -3

    this.scene.add(this.mesh)
  }

  update() {
    // time.elapsed 单位是毫秒，换算成秒（重构前用的是 clock.getElapsedTime()）
    const elapsedTime = this.time.elapsed * 0.001

    this.mesh.rotation.x = -elapsedTime * 0.1
    this.mesh.rotation.y = elapsedTime * 0.2
  }

  destroy() {
    // 几何体自己创建自己释放；材质归 HalftoneMaterial，不在这里 dispose
    this.scene.remove(this.mesh)
    this.geometry.dispose()
  }
}
