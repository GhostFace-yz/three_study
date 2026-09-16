import * as THREE from 'three'

/**
 * 渲染器：只负责实例、尺寸与清屏色。
 * 注意：这里刻意不设置 toneMapping / outputColorSpace（保持 three 默认值），
 * 因为 halftone 片元着色器里已经手动 `#include <tonemapping_fragment>` 和
 * `<colorspace_fragment>`，着色器与渲染器两边都设会重复处理、画面变样。
 */
export default class Renderer {
  constructor(experience) {
    this.experience = experience
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.camera = this.experience.camera
    this.debug = this.experience.debug

    this.setParameters()
    this.setInstance()
    this.setDebug()
  }

  setParameters() {
    this.parameters = {
      clearColor: '#26132f',
    }
  }

  setInstance() {
    // 传入项目已有的 <canvas>，而不是让 three 自己新建
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })

    this.instance.setClearColor(this.parameters.clearColor)

    this.resize()
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('renderer')
      this.debugFolder
        .addColor(this.parameters, 'clearColor')
        .name('清屏色')
        .onChange(() => {
          this.instance.setClearColor(this.parameters.clearColor)
        })
    }
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  update() {
    this.instance.render(this.scene, this.camera.instance)
  }
}
