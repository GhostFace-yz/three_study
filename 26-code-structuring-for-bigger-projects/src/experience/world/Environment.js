import { DirectionalLight } from 'three'
import { SRGBColorSpace, Mesh, MeshStandardMaterial } from 'three'

export default class Environment {
  constructor(experience) {
    this.experience = experience
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug
    if(this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('environment')
    }

    this.setSunLight()
    this.setEnvMap()
  }
  setSunLight() {
    this.sunLight = new DirectionalLight('#ffffff', 4)
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.normalBias = 0.05
    this.sunLight.position.set(3.5, 2, -1.25)
    this.scene.add(this.sunLight)

    if(this.debug.active) {
      this.debugFolder.add(this.sunLight, 'intensity').name('日光强度').min(0).max(10).step(.001)
      this.debugFolder.add(this.sunLight.position, 'x').name('日光位置X').min(-5).max(5).step(.001)
      this.debugFolder.add(this.sunLight.position, 'y').name('日光位置y').min(-5).max(5).step(.001)
      this.debugFolder.add(this.sunLight.position, 'z').name('日光位置z').min(-5).max(5).step(.001)
    }
  }
  setEnvMap() {
    this.envMap = {
      intensity: .4,
      texture: this.resources.items.environmentMapTexture
    }
    this.envMap.texture.colorSpace = SRGBColorSpace
    this.scene.environment = this.envMap.texture
    this.setEnvMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
          child.material.envMap = this.envMap.texture
          child.material.envMapIntensity = this.envMap.intensity
          child.material.needsUpdate = true
        }
      })
    }
    this.setEnvMap.updateMaterials()
    if(this.debug.active) {
      this.debugFolder.add(this.envMap, 'intensity').name('环境光强度').min(0).max(4).step(.001).onChange(this.setEnvMap.updateMaterials)
    }
  }
}