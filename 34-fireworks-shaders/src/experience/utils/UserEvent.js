import EventEmitter from './EventEmitter.js'

export default class UserEvent extends EventEmitter {
  constructor() {
    super()
    this.clickEvent()
  }
  clickEvent() {
    window.addEventListener('click', () => {
      this.trigger('click')
    })
  }
}

