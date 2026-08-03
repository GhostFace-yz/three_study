import Sizes from "./utils/Sizes.js";
import Time from './utils/Time.js'
import Camera from './Camera.js'
import World from './world/World.js'
import { Scene, Color } from 'three'
import Renderer from "./Render.js";

export default class Experience {
  constructor(canvas) {
    window.experience = this
    this.canvas = canvas
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new Scene()

    this.camera = new Camera(this)
    this.renderer = new Renderer(this)
    this.world = new World(this)
    this.sizes.on('resize', () => {
      this.resize()
    })
    this.time.on('tick', () => {
      this.update()
    })
  }
  resize() {
    this.camera.resize()
    this.renderer.resize()
  }
  update() {
    this.camera.update()
    this.renderer.update()
  }
}