import Environment from './Environment.js'
import Test from './Test.js'

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

    // 资源清单为空时（本项目无资源）不会触发 ready，直接创建不依赖资源的对象
    if (this.resources.toLoad === 0) {
      this.setSceneObjects()
    } else {
      this.resources.on('ready', () => {
        this.setSceneObjects()
      })
    }
  }

  setSceneObjects() {
    this.test = new Test(this.experience)
    this.environment = new Environment(this.experience)
  }

  update() {
    if (this.test) {
      this.test.update()
    }
  }

  destroy() {
    if (this.test) {
      this.test.destroy()
    }
  }
}
