import * as THREE from 'three'
import shadingVertexShader from '/shaders/shading/vertex.glsl'
import shadingFragmentShader from '/shaders/shading/fragment.glsl'

/**
 * 光照与着色：35 课《Lights and shading shaders》的场景对象。
 * 自定义 ShaderMaterial（uColor 纯色），三个物体共享同一份材质；
 * 不受光照影响，因此不需要 Environment（灯光）。
 */
export default class Shading {
  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene
    this.resources = experience.resources
    this.time = experience.time
    this.debug = experience.debug

    // 与原 script.js 一致的可调参数
    this.materialParameters = { color: '#ffffff' }

    this.setMaterial()
    this.setObjects()
    this.setDebug()
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: shadingVertexShader,
      fragmentShader: shadingFragmentShader,
      uniforms: {
        uColor: new THREE.Uniform(new THREE.Color(this.materialParameters.color)),
      },
    })
  }

  setObjects() {
    // Torus knot
    this.torusKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
      this.material,
    )
    this.torusKnot.position.x = 3
    this.scene.add(this.torusKnot)

    // Sphere
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(),
      this.material,
    )
    this.sphere.position.x = -3
    this.scene.add(this.sphere)

    // Suzanne（resources ready 后保证存在；gltf 对象取 .scene，遍历替换材质）
    this.suzanne = this.resources.items.suzanne.scene
    this.suzanne.traverse((child) => {
      if (child.isMesh) {
        child.material = this.material
      }
    })
    this.scene.add(this.suzanne)


    // 光线辅助器
    this.directionalHelper = new THREE.Mesh(
      new THREE.PlaneGeometry(),
      new THREE.MeshBasicMaterial()
    )
    this.directionalHelper.material.color.setRGB(.1, .1, 1)
    this.directionalHelper.material.side = THREE.DoubleSide
    this.directionalHelper.position.set(0, 0, 3)
    this.scene.add(this.directionalHelper)


  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('shading')
      this.debugFolder
        .addColor(this.materialParameters, 'color')
        .onChange(() => {
          this.material.uniforms.uColor.value.set(this.materialParameters.color)
        })
    }
  }

  update() {
    // 与原 script.js 一致：三个物体同速旋转（time.elapsed 单位是秒）
    this.suzanne.rotation.x = -this.time.elapsed * .001 * 0.1
    this.suzanne.rotation.y = this.time.elapsed * 0.2 * .001

    this.sphere.rotation.x = -this.time.elapsed * 0.1 * .001
    this.sphere.rotation.y = this.time.elapsed * 0.2 * .001

    this.torusKnot.rotation.x = -this.time.elapsed * 0.1 * .001
    this.torusKnot.rotation.y = this.time.elapsed * 0.2 * .001
  }

  destroy() {
    // 释放自己创建的资源
    this.scene.remove(this.torusKnot, this.sphere, this.suzanne)
    this.torusKnot.geometry.dispose()
    this.sphere.geometry.dispose()
    this.material.dispose()
  }
}
