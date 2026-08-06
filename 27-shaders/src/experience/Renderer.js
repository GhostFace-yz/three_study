import { WebGLRenderer } from 'three'

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
    // 重构时保持原项目配置（无 antialias/toneMapping/阴影，画面不变）。
    // 项目需要时可在此追加推荐配置：
    //   this.instance.antialias 需在构造参数里开（见下行注释）
    //   this.instance.outputColorSpace = SRGBColorSpace
    //   this.instance.toneMapping = CineonToneMapping
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
    })

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
