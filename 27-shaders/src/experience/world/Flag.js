import * as THREE from 'three'
import testVertexShader from '../../shader/test/vertex.glsl'
import testFragmentShader from '../../shader/test/frament.glsl'
import { GUI } from 'lil-gui';

/**
 * 旗帜平面（原 script.js 中的 Test mesh）。
 * 后续 shader 练习的载体：给 material 换 ShaderMaterial，加 uniforms 动画。
 */
export default class Flag {
  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene
    this.resources = experience.resources
    this.time = experience.time
    this.debug = experience.debug


    this.setGeometry()
    this.setMaterial()
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('flag')
      this.debug.ui.add(this.material.uniforms.uFrequency.value, 'x').min(0).max(20).step(.01).name('频率x')
      this.debug.ui.add(this.material.uniforms.uFrequency.value, 'y').min(0).max(20).step(.01).name('频率y')
    }

    this.setMesh()
  }

  setGeometry() {
    // 保持原项目细分：32x32，足够 shader 做波浪形变
    this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32)
    const count = this.geometry.attributes.position.count
    const randoms = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random()
    }
    this.geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
  }

  setMaterial() {
    // 重构时保持原状：无纹理的 MeshBasicMaterial（画面不变）。
    // 启用纹理（static/textures/flag-french.jpg，sources.js 已登记为 flagTexture）：
    // const texture = this.resources.items.flagTexture
    // texture.colorSpace = THREE.SRGBColorSpace
    // this.material = new THREE.MeshBasicMaterial({ map: texture })
    const flagTexture = this.resources.items['flagTexture']
    
    this.material = new THREE.ShaderMaterial(
      {
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        transparent: true,
        uniforms: {
          uFrequency: { value: new THREE.Vector2(10, 5) },
          uTime: { value: 0 },
          uColor: { value: new THREE.Color('orange') },
          uTexture: { value: flagTexture }
        },
        side: true
      }
    )
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.scale.y  = 2/ 3
    this.scene.add(this.mesh)
  }


  update() {
    // 每帧执行。time.elapsed / time.delta 单位是毫秒（ms），转秒要除以 1000：
    // this.mesh.rotation.y = this.time.elapsed * 0.001
    this.material.uniforms.uTime.value = this.time.elapsed * .001
    
  }

  destroy() {
    // 释放自己创建的资源
    this.scene.remove(this.mesh)
    this.geometry.dispose()
    this.material.dispose()
  }
}
