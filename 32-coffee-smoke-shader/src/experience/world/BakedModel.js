import * as THREE from 'three'

/**
 * 烘焙咖啡杯模型：32 课《Coffee Smoke Shader》的场景对象。
 * 模型是烘焙光照（baked），因此不需要任何灯光/环境贴图。
 * 原代码逻辑：找到 'baked' 网格，把贴图 anisotropy 提到 8（斜视角更清晰）。
 */
export default class BakedModel {
  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene
    this.resources = experience.resources
    this.debug = experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('bakedModel')
    }

    this.setModel()
  }

  setModel() {
    this.model = this.resources.items.bakedModel.scene
    this.model.getObjectByName('baked').material.map.anisotropy = 8
    this.scene.add(this.model)
  }

  update() {
    // 每帧执行（time.delta 单位是毫秒）：
    // 课程后续的烟雾 shader 在这里更新 uniform：this.material.uniforms.uTime.value = this.time.elapsed * 0.001
  }

  destroy() {
    // 模型资源由 Resources 统一持有，这里只从场景移除
    this.scene.remove(this.model)
  }
}
