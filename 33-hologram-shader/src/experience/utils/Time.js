import EventEmitter from './EventEmitter.js'

/**
 * requestAnimationFrame 循环的唯一管理者。
 * 每帧广播 'tick' 事件，其他模块订阅即可，不要在别处再起 rAF。
 * 注意：delta 和 elapsed 单位是毫秒（ms），换算成秒时除以 1000。
 */
export default class Time extends EventEmitter {
  constructor() {
    super()

    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }

  tick() {
    const currentTime = Date.now()

    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start

    this.trigger('tick')

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }
}
