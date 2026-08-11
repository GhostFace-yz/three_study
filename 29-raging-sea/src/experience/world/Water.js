import * as THREE from 'three'

/**
 * 水面：Raging Sea 课程的水面平面。
 * 目前是纯色 MeshBasicMaterial，后续换成自定义 shader 材质时
 * 在此文件内替换 setMaterial，并可在 update() 里更新 uniform。
 */
export default class Water {
  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene
    this.debug = experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('water')
    }

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 128, 128)
  }

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial()
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI * 0.5
    this.scene.add(this.mesh)
  }

  update() {
    // 每帧执行（time.delta 单位是毫秒）：
    // 后续 shader 材质可在这里更新 uniform：this.material.uniforms.uTime.value = this.time.elapsed * 0.001
  }

  destroy() {
    // 释放自己创建的资源
    this.scene.remove(this.mesh)
    this.geometry.dispose()
    this.material.dispose()
  }
}
