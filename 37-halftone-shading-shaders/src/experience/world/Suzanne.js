/**
 * Suzanne 模型：模型由 Resources 提前加载好（World 保证 ready 之后才创建本对象），
 * 这里只负责换成共享的 halftone 材质并加进场景。
 */
export default class Suzanne {
  constructor(experience, halftoneMaterial) {
    this.experience = experience
    this.scene = experience.scene
    this.resources = experience.resources
    this.time = experience.time
    this.halftoneMaterial = halftoneMaterial

    this.setModel()
  }

  setModel() {
    this.model = this.resources.items.suzanneModel.scene

    // 模型自带的材质换成共享的 halftone 材质（重构前就是这么做的）
    this.model.traverse((child) => {
      if (child.isMesh) {
        child.material = this.halftoneMaterial.instance
      }
    })

    this.scene.add(this.model)
  }

  update() {
    // time.elapsed 单位是毫秒，换算成秒（重构前用的是 clock.getElapsedTime()）
    const elapsedTime = this.time.elapsed * 0.001

    this.model.rotation.x = -elapsedTime * 0.1
    this.model.rotation.y = elapsedTime * 0.2
  }

  destroy() {
    // 模型几何体由加载器创建，逐个释放；材质归 HalftoneMaterial，不在这里 dispose
    this.scene.remove(this.model)
    this.model.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose()
      }
    })
  }
}
