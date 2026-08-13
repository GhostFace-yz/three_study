import * as THREE from 'three'

/**
 * Lee Perry Smith 头部模型：31 课《Modified Materials》的场景对象。
 * 材质与原 script.js 一致（color 贴图 + normal 贴图），
 * 阴影设置跟随对象（架构规范：阴影/材质调整跟对象走）。
 */
export default class LeePerrySmith {

  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene
    this.resources = experience.resources
    this.debug = experience.debug
    this.time = experience.time

    this.customUniforms = {
      uTime: { value: 0 },
      uAngle: { value: .9 }
    }

    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15, 15),
      new THREE.MeshStandardMaterial({ color: '#ffffff', side: THREE.DoubleSide })
    )

    this.plane.rotateY.y = -Math.PI * 0.5
    this.plane.position.y = -5
    this.plane.position.z = 5
    this.plane.receiveShadow = true
    this.scene.add(this.plane)

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('leePerrySmith')
    }
    this.setMaterial()
    this.setModel()

  }

  setMaterial() {
    // 纹理在 Resources 里已加载完成（World 在 ready 后创建本对象）
    const colorTexture = this.resources.items.colorTexture
    colorTexture.colorSpace = THREE.SRGBColorSpace

    this.material = new THREE.MeshStandardMaterial({
      map: colorTexture,
      normalMap: this.resources.items.normalTexture,
    })

    this.depthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking
    })

    this.material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.customUniforms.uTime
      shader.uniforms.uAngle = this.customUniforms.uAngle
      shader.vertexShader = shader.vertexShader.replace('#include <common>',
        `#include <common>
        uniform float uTime;
        uniform float uAngle;
          mat2 get2dRotateMatrix(float _angle) {
            return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
          }`)
      shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>',
        `
        #include <beginnormal_vertex>
        float angle = -(position.y + uTime) * uAngle;
        mat2 rotateMatrix = get2dRotateMatrix(angle);
        objectNormal.xz = objectNormal.xz * rotateMatrix;
        `
      )
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',
        `
          #include <begin_vertex>
          
          // float angle = -(position.y + uTime) * .8;
          // mat2 rotateMatrix = get2dRotateMatrix(angle);

          transformed.xz = transformed.xz * rotateMatrix;
      `)
    }

    this.depthMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.customUniforms.uTime
      shader.uniforms.uAngle = this.customUniforms.uAngle
      shader.vertexShader = shader.vertexShader.replace('#include <common>',
        `#include <common>
         uniform float uAngle;
          uniform float uTime;
          mat2 get2dRotateMatrix(float _angle) {
            return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
          }`)

      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',
        `
          #include <begin_vertex>
          float angle = -(position.y + uTime) * uAngle;
          mat2 rotateMatrix = get2dRotateMatrix(angle);
          transformed.xz = transformed.xz * rotateMatrix;
      `)
    }
    this.debugFolder.add(this.customUniforms.uAngle, 'value').name('扭曲角度').min(0.0).max(5.0).step(.1)
  }

  setModel() {
    const gltf = this.resources.items.leePerrySmithModel
    this.mesh = gltf.scene.children[0]
    this.mesh.rotation.y = Math.PI * 0.5
    this.mesh.material = this.material
    this.mesh.customDepthMaterial = this.depthMaterial
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    this.scene.add(this.mesh)
  }

  update() {
    this.customUniforms.uTime.value = this.time.elapsed * .001
  }
  destroy() {
    // 释放自己创建的资源（几何体属于 GLTF 资源，由 Resources 统一持有，不在此 dispose）
    this.scene.remove(this.mesh)
    this.material.dispose()
  }
}
