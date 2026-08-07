import * as THREE from 'three'

/**
 * 环境：主光源（通用模式，按需增删）。
 * 原项目无灯光（ShaderMaterial 不受光照影响），此光源不影响画面，
 * 供后续使用受光材质时直接可用。
 * 若配置了 environmentMapTexture（sources.js），还会设置环境贴图。
 */
export default class Environment {
  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene
    this.resources = experience.resources
    this.debug = experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('environment')
    }

    this.setSunLight()

    // 没配置环境贴图就不设置
    const envMapTexture = this.resources.items.environmentMapTexture
    if (envMapTexture) {
      this.setEnvMap(envMapTexture)
    }
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.normalBias = 0.05
    this.sunLight.position.set(3.5, 2, -1.25)
    this.scene.add(this.sunLight)

    if (this.debug.active) {
      this.debugFolder.add(this.sunLight, 'intensity').name('日光强度').min(0).max(10).step(0.001)
      this.debugFolder.add(this.sunLight.position, 'x').name('日光位置X').min(-5).max(5).step(0.001)
      this.debugFolder.add(this.sunLight.position, 'y').name('日光位置y').min(-5).max(5).step(0.001)
      this.debugFolder.add(this.sunLight.position, 'z').name('日光位置z').min(-5).max(5).step(0.001)
    }
  }

  setEnvMap(envMapTexture) {
    this.envMap = {
      intensity: 0.4,
      texture: envMapTexture,
    }

    envMapTexture.colorSpace = THREE.SRGBColorSpace
    this.scene.environment = envMapTexture
    this.updateMaterials()

    if (this.debug.active) {
      this.debugFolder.add(this.envMap, 'intensity').name('环境光强度').min(0).max(4).step(0.001).onChange(() => {
        this.updateMaterials()
      })
    }
  }

  // 遍历场景，把环境贴图应用到所有标准材质（改变 envMapIntensity 后需要重设）
  updateMaterials() {
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.envMap = this.envMap.texture
        child.material.envMapIntensity = this.envMap.intensity
        child.material.needsUpdate = true
      }
    })
  }
}
