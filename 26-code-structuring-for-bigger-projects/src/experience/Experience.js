import Sizes from "./utils/Sizes.js";
import Time from './utils/Time.js'
import Camera from './Camera.js'
import World from './world/World.js'
import { Scene, Color, Mesh } from 'three'
import Renderer from "./Render.js";
import Resources from "./utils/Resources.js";
import sources from './sources.js'
import Debug from './utils/Debug.js'

export default class Experience {
  constructor(canvas) {
    window.experience = this
    this.canvas = canvas

    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new Scene()
    this.camera = new Camera(this)
    this.renderer = new Renderer(this)
    this.resources = new Resources(sources)
    this.world = new World(this)
    this.sizes.on('resize', () => {
      this.resize()
    })
    this.time.on('tick', () => {
      this.update()
    })
    if (this.debug.active) {
      const debugObject = {
        destroy: () => { this.destroy() }
      }
      this.debug.ui.addFolder('操作').add(debugObject, 'destroy').name('消毁')
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
    this.sizes.off('resize')
    this.time.off('tick')

    this.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose()
        for (const key in child.material) {
          const value = child.material[key]
          if (value && value.dispose === 'function') {
            value.dispose()
          }
        }
      }
    })
    this.camera.controls.dispose()
    this.renderer.instance.dispose()
    if (this.debug.active) {
      this.debug.ui.destroy()
    }
  }
}