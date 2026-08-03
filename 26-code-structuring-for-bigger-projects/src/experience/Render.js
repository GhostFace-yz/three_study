import { WebGLRenderer, SRGBColorSpace, CineonToneMapping, PCFSoftShadowMap } from 'three'

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
    // 创建 WebGL 渲染器实例
    // canvas: 传入项目中已有的 <canvas> 元素，而不是让 three.js 自己新建一个
    // antialias: 开启抗锯齿，让物体边缘更平滑（有轻微性能开销）
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })

    // 使用物理单位的光照强度（真实的光线衰减效果）
    // 注意：新版本 three.js 已移除该属性（默认强制开启），这里是课程版本写法
    this.instance.physicallyCorrectLights = true

    // 输出色彩空间设为 sRGB：颜色按 sRGB 色域输出到屏幕，保证色彩显示正确
    // （不设置的话画面会偏暗/偏灰）
    this.instance.outputColorSpace = SRGBColorSpace

    // 色调映射：把 HDR 高动态范围的颜色压回屏幕能显示的 LDR 范围
    // Cineon 是电影风格的映射曲线，对比度柔和、观感偏"胶片感"
    this.instance.toneMapping = CineonToneMapping

    // 曝光度：整体画面的亮度，1.75 表示比默认(1.0)更亮一些
    this.instance.toneMappingExposure = 1.75

    // 开启阴影渲染（默认关闭；不开则场景里所有阴影都不显示）
    this.instance.shadowMap.enabled = true

    // 阴影算法：PCF 柔和阴影，让阴影边缘有软过渡，而不是生硬的锯齿边
    // （渲染质量更高，性能略低于默认的 BasicShadowMap）
    this.instance.shadowMap.type = PCFSoftShadowMap

    // 设置渲染画布尺寸（单位：像素），与浏览器窗口大小保持一致
    this.instance.setSize(this.sizes.width, this.sizes.height)

    // 设置像素比（适配 Retina 高清屏），上限 2 防止超高 DPI 屏幕渲染过载
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }
  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }
  update() {
   this.instance.render(this.scene, this.camera.instance)
  }
}