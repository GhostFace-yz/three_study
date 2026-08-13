import * as THREE from 'three'

/**
 * 环境：主光源 + 环境贴图。
 * 环境贴图来自 resources.items.environmentMapTexture（sources.js 里配置）。
 * 灯光参数、background、envMapIntensity 忠实迁移自原 script.js。
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

    // 没配置环境贴图就不设置（模板初始 sources 为空，这里必须可缺省）
    const envMapTexture = this.resources.items.environmentMapTexture
    if (envMapTexture) {
      this.setEnvMap(envMapTexture)
    }
  }

  setSunLight() {
    // 与原 script.js 一致：强度 3、位置 (0.25, 2, -2.25)
    this.sunLight = new THREE.DirectionalLight('#ffffff', 3)
    this.sunLight.castShadow = true
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.normalBias = 0.05
    this.sunLight.position.set(0.25, 2, -2.25)
    this.scene.add(this.sunLight)

    if (this.debug.active) {
      this.debugFolder
        .add(this.sunLight, 'intensity')
        .name('日光强度')
        .min(0)
        .max(10)
        .step(0.001)
      this.debugFolder
        .add(this.sunLight.position, 'x')
        .name('日光位置X')
        .min(-5)
        .max(5)
        .step(0.001)
      this.debugFolder
        .add(this.sunLight.position, 'y')
        .name('日光位置y')
        .min(-5)
        .max(5)
        .step(0.001)
      this.debugFolder
        .add(this.sunLight.position, 'z')
        .name('日光位置z')
        .min(-5)
        .max(5)
        .step(0.001)
    }
  }

  setEnvMap(envMapTexture) {
    this.envMap = {
      intensity: 1, // 与原 script.js 的 envMapIntensity = 1 一致
      texture: envMapTexture,
    }

    envMapTexture.colorSpace = THREE.SRGBColorSpace
    this.scene.environment = envMapTexture
    this.scene.background = envMapTexture // 原代码同时设置了 background
    this.updateMaterials()

    if (this.debug.active) {
      this.debugFolder
        .add(this.envMap, 'intensity')
        .name('环境光强度')
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(() => {
          this.updateMaterials()
        })
    }
  }

  // 遍历场景，把环境贴图应用到所有标准材质（改变 envMapIntensity 后需要重设）
  updateMaterials() {
    this.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.material.envMap = this.envMap.texture
        child.material.envMapIntensity = this.envMap.intensity
        child.material.needsUpdate = true
      }
    })
  }
}
