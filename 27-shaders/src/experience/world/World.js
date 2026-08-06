import Environment from './Environment.js'
import Flag from './Flag.js'

/**
 * 场景对象管理器。
 * 所有依赖资源的场景对象都在 resources ready 之后创建，
 * 保证创建时 this.resources.items.xxx 一定存在。
 */
export default class World {
  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene
    this.resources = experience.resources

    this.resources.on('ready', () => {
      this.setSceneObjects()
    })
  }

  setSceneObjects() {
    this.flag = new Flag(this.experience)
    this.environment = new Environment(this.experience)
  }

  update() {
    if (this.flag) {
      this.flag.update()
    }
  }

  destroy() {
    if (this.flag) {
      this.flag.destroy()
    }
  }
}
