import { WebGLRenderer, SRGBColorSpace } from 'three'

export default class Renderer {
  constructor(experience) {
    this.experience = experience
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.camera = this.experience.camera

    this.setInstance()
  }

  setInstance() {
    // 传入项目已有的 <canvas>，而不是让 three 自己新建
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
    })

    // 输出色彩空间 sRGB：three 新版默认即为 sRGB，显式写出便于阅读
    this.instance.outputColorSpace = SRGBColorSpace

    // 与原 script.js 一致：本项目不启用色调映射与阴影
    this.resize()
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }
  getPixelRatio() { return this.instance.getPixelRatio() }
  update() {
    this.instance.render(this.scene, this.camera.instance)
  }
}
