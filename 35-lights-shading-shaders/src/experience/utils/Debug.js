import GUI from 'lil-gui'

/**
 * 调试面板门控：URL 带 #debug 才启用。
 * 线上直接访问 https://xxx/#debug 即可打开，无需改代码开关。
 */
export default class Debug {
  constructor() {
    this.active = window.location.hash === '#debug'

    if (this.active) {
      this.ui = new GUI()
    }
  }
}
