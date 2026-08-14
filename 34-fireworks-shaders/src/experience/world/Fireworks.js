import * as THREE from 'three'

/**
 * 烟花：34 课《Fireworks Shaders》的场景对象。
 * 目前是课程的占位盒子，后续课程会替换成粒子系统
 * （BufferGeometry 位置/颜色 + 自定义 ShaderMaterial）。
 * MeshBasicMaterial 不受光照影响，因此不需要 Environment（灯光）。
 */
export default class Fireworks {
  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene
    this.resources = experience.resources
    this.time = experience.time
    this.debug = experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('fireworks')
    }

    // this.setGeometry()
    // this.setMaterial()
    // this.setMesh()
    this.createFirework(100, new THREE.Vector3())
  }

  createFirework(count, position) {
    const positionsArray = new Float32Array(count * 3)
    for (let i = 0; i< count; i++) {
      const i3 = i* 3
      positionsArray[i3] = Math.random() - .5
      positionsArray[i3 + 1] = Math.random() - .5
      positionsArray[i3 + 2] = Math.random() - .5
    }

    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3))
  
    this.material = new THREE.PointsMaterial()
    this.firework = new THREE.Points(
      this.geometry,
      this.material
    )
    this.firework.position.copy(position)
    this.scene.add(this.firework)
  }

  setGeometry() {

  }

  setMaterial() {

  }

  setMesh() {

  }

  update() {
    // 每帧执行（time.delta 单位是毫秒）：
    // 后续粒子系统在这里更新 uniform / 位置
  }

  destroy() {
    // 释放自己创建的资源
    this.scene.remove(this.mesh)
    this.geometry.dispose()
    this.material.dispose()
  }
}
