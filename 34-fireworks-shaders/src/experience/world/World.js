import Fireworks from './Fireworks.js'
import customSky from './Sky.js'

/**
 * 场景对象管理器。
 * 所有依赖资源的场景对象（模型/地板/环境）都在 resources ready 之后创建，
 * 保证创建时 this.resources.items.xxx 一定存在。
 * 占位盒子用 MeshBasicMaterial（不受光照影响），不需要 Environment（灯光）。
 */
export default class World {
  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene
    this.resources = experience.resources

    // 资源清单为空时（模板初始状态）不会触发 ready，直接创建不依赖资源的对象
    if (this.resources.toLoad === 0) {
      this.setSceneObjects()
    } else {
      this.resources.on('ready', () => {
        this.setSceneObjects()
      })
    }
  }

  setSceneObjects() {
    this.fireworks = new Fireworks(this.experience)
    this.sky = new customSky(this.experience)
  }

  update() {
    if (this.fireworks) {
      this.fireworks.update()
    }
  }

  destroy() {
    if (this.fireworks) {
      this.fireworks.destroy()
    }
  }
}
