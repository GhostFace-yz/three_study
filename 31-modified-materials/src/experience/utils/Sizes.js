import EventEmitter from './EventEmitter.js'

/**
 * 窗口尺寸与像素比，唯一窗口 resize 监听者。
 * 窗口变化时更新自身并广播 'resize' 事件，其他模块订阅即可。
 */
export default class Sizes extends EventEmitter {
  constructor() {
    super()

    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)

      this.trigger('resize')
    })
  }
}
