import HalftoneMaterial from './HalftoneMaterial.js'
import TorusKnot from './TorusKnot.js'
import Sphere from './Sphere.js'
import Suzanne from './Suzanne.js'

/**
 * 场景对象管理器。
 * 依赖资源的对象（Suzanne）在 resources ready 之后才创建，
 * 保证创建时 this.resources.items.suzanneModel 一定存在。
 */
export default class World {
  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene
    this.resources = experience.resources

    // 资源清单为空时不会触发 ready，直接创建（不依赖资源的）场景对象
    if (this.resources.toLoad === 0) {
      this.setSceneObjects()
    } else {
      this.resources.on('ready', () => {
        this.setSceneObjects()
      })
    }
  }

  setSceneObjects() {
    // 三个物体共用同一份材质（重构前就是共用的），所以材质在这里只创建一次
    this.halftoneMaterial = new HalftoneMaterial(this.experience)

    this.torusKnot = new TorusKnot(this.experience, this.halftoneMaterial)
    this.sphere = new Sphere(this.experience, this.halftoneMaterial)
    this.suzanne = new Suzanne(this.experience, this.halftoneMaterial)
  }

  update() {
    if (this.torusKnot) {
      this.torusKnot.update()
    }
    if (this.sphere) {
      this.sphere.update()
    }
    if (this.suzanne) {
      this.suzanne.update()
    }
  }

  destroy() {
    if (this.torusKnot) {
      this.torusKnot.destroy()
    }
    if (this.sphere) {
      this.sphere.destroy()
    }
    if (this.suzanne) {
      this.suzanne.destroy()
    }
    if (this.halftoneMaterial) {
      this.halftoneMaterial.destroy()
    }
  }
}
