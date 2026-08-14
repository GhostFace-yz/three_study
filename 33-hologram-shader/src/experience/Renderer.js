import { WebGLRenderer, SRGBColorSpace } from 'three'

export default class Renderer {
  constructor(experience) {
    this.experience = experience
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.camera = this.experience.camera
    this.debug = this.experience.debug

    this.setInstance()
  }

  setInstance() {
    // 传入项目已有的 <canvas>，而不是让 three 自己新建
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })

    // 输出色彩空间 sRGB：three 新版默认即为 sRGB，显式写出便于阅读
    this.instance.outputColorSpace = SRGBColorSpace

    // 与原 script.js 一致：深色背景、无色调映射与阴影
    this.rendererParameters = {}
    this.rendererParameters.clearColor = '#1d1f2a'
    this.instance.setClearColor(this.rendererParameters.clearColor)

    // 背景色调试面板（原代码的 gui.addColor，归位到渲染器自己身上）
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('renderer')
      this.debugFolder
        .addColor(this.rendererParameters, 'clearColor')
        .onChange(() => {
          this.instance.setClearColor(this.rendererParameters.clearColor)
        })
    }

    this.resize()
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }

  update() {
    this.instance.render(this.scene, this.camera.instance)
  }
}
