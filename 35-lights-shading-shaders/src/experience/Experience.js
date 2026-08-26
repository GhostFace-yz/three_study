import * as THREE from 'three'
import Debug from './utils/Debug.js'
import Sizes from './utils/Sizes.js'
import Time from './utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Resources from './utils/Resources.js'
import sources from './sources.js'
import World from './world/World.js'

/**
 * 组合根（Composition Root）：所有模块的创建、串联、销毁都发生在这里。
 * 构造函数按依赖顺序创建模块：
 *   Debug → Sizes → Time → Scene → Camera → Renderer → Resources → World
 * 之后订阅全局事件（resize / tick），把事件分发到各模块。
 */
export default class Experience {
  constructor(canvas) {
    // 全局实例：浏览器控制台里可通过 window.experience 调试
    window.experience = this

    this.canvas = canvas
    this.scene = new THREE.Scene()

    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.camera = new Camera(this)
    this.renderer = new Renderer(this)
    this.resources = new Resources(sources)
    this.world = new World(this)

    // 订阅全局事件（只需在组合根订阅一次，不要再重复监听 window）
    this.sizes.on('resize', () => {
      this.resize()
    })
    this.time.on('tick', () => {
      this.update()
    })

    // 调试面板：提供销毁入口
    if (this.debug.active) {
      const debugObject = {
        destroy: () => {
          this.destroy()
        },
      }
      this.debug.ui.addFolder('Debug').add(debugObject, 'destroy').name('destroy')
    }
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    this.camera.update()
    this.world.update()
    this.renderer.update()
  }

  destroy() {
    // 1. 取消事件订阅
    this.sizes.off('resize')
    this.time.off('tick')

    // 2. 级联销毁场景对象（各对象释放自己创建的资源）
    this.world.destroy()

    // 3. 遍历场景兜底：释放所有网格的几何体与材质
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        for (const key in child.material) {
          const value = child.material[key]
          if (value && typeof value.dispose === 'function') {
            value.dispose()
          }
        }
      }
    })

    // 4. 释放控制器与渲染器
    this.camera.controls.dispose()
    this.renderer.instance.dispose()

    // 5. 销毁调试面板
    if (this.debug.active) {
      this.debug.ui.destroy()
    }
  }
}
