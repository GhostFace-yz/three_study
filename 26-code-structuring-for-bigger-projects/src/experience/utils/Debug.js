import GUI from 'lil-gui'

export default class Debug {
  constructor(experience) {
    this.active = window.location.hash === '#debug'
    if (this.active) {
      this.ui = new GUI()
    }
  }
}