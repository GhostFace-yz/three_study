import * as THREE from 'three'
import holographicVertex from '/shader/holographic/vertex.glsl'
import holographicFragment from '/shader/holographic/fragment.glsl'


/**
 * 全息场景对象：33 课《Hologram Shader》的三个旋转物体。
 * torus knot / sphere / suzanne 模型共享同一材质（课程后续会换成全息 shader 材质），
 * 原代码里三个物体同速旋转。
 * MeshBasicMaterial 不受光照影响，因此不需要 Environment（灯光）。
 */
export default class Hologram {
  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene
    this.resources = experience.resources
    this.time = experience.time
    this.debug = experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('hologram')
    }
    this.materialParam = {
      color: '#70c1ff'
    }
    this.setMaterial()
    this.setTorusKnot()
    this.setSphere()
    this.setSuzanne()
  }

  setMaterial() {
    // 三个物体共享同一材质（与原代码一致）
    this.material = new THREE.ShaderMaterial({
      vertexShader: holographicVertex,
      fragmentShader: holographicFragment,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uColor: new THREE.Uniform(new THREE.Color(this.materialParam.color)),
      },
    })
    if (this.debug.active) {
      this.debugFolder.addColor(this.materialParam, 'color').name('全息颜色').onChange(() => {
        this.material.uniforms.uColor.value.set(this.materialParam.color)
      })
    }
  }

  setTorusKnot() {
    this.torusKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
      this.material,
    )
    this.torusKnot.position.x = 3
    this.scene.add(this.torusKnot)
  }

  setSphere() {
    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(), this.material)
    this.sphere.position.x = -3
    this.scene.add(this.sphere)
  }

  setSuzanne() {
    // 模型在 Resources 里已加载完成（World 在 ready 后创建本对象）
    this.suzanne = this.resources.items.suzanneModel.scene
    this.suzanne.traverse((child) => {
      if (child.isMesh) {
        child.material = this.material
      }
    })
    this.scene.add(this.suzanne)
  }

  update() {
    // 原代码：三个物体同速旋转（time.elapsed 单位毫秒，除以 1000 转成秒）
    const elapsed = this.time.elapsed * 0.001

    // this.suzanne.rotation.x = -elapsed * 0.1
    // this.suzanne.rotation.y = elapsed * 0.2
    // this.sphere.rotation.x = -elapsed * 0.1
    // this.sphere.rotation.y = elapsed * 0.2
    // this.torusKnot.rotation.x = -elapsed * 0.1
    // this.torusKnot.rotation.y = elapsed * 0.2

    this.material.uniforms.uTime.value = elapsed
  }

  destroy() {
    // 释放自己创建的资源（suzanne 的几何体属于 GLTF 资源，由 Resources 统一持有）
    this.scene.remove(this.torusKnot)
    this.scene.remove(this.sphere)
    this.scene.remove(this.suzanne)
    this.torusKnot.geometry.dispose()
    this.sphere.geometry.dispose()
    this.material.dispose()
  }
}
