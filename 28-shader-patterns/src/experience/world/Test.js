import * as THREE from 'three'
import testVertexShader from '../../shaders/test/vertex.glsl'
import testFragmentShader from '../../shaders/test/fragment.glsl'

/**
 * Shader 测试平面（原 script.js 中的 Test mesh）。
 * shader 图案练习的载体：fragment.glsl 里实现各种图案，
 * 需要动画时在 setMaterial 里声明 uniform 并在 update() 中更新。
 */
export default class Test {
  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene
    this.time = experience.time
    this.debug = experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('test')
    }

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    // 保持原项目细分：32x32
    this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32)
  }

  setMaterial() {
    // 保持原项目：ShaderMaterial + DoubleSide（shader 文件在 src/shaders/ 由 vite-plugin-glsl 编译）
    this.material = new THREE.ShaderMaterial({
      vertexShader: testVertexShader,
      fragmentShader: testFragmentShader,
      side: THREE.DoubleSide,
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  update() {
    // 每帧执行。time.elapsed / time.delta 单位是毫秒（ms），转秒要除以 1000：
    // this.material.uniforms.uTime.value = this.time.elapsed * 0.001
  }

  destroy() {
    // 释放自己创建的资源
    this.scene.remove(this.mesh)
    this.geometry.dispose()
    this.material.dispose()
  }
}
