import { PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export default class Camera {
  constructor(experience) {
    this.sizes = experience.sizes
    this.scene = experience.scene
    this.canvas = experience.canvas

    this.setInstance()
    this.setOrbitControls()
  }

  setInstance() {
    this.instance = new PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      100,
    )
    this.instance.position.set(3, 3, 3)
    this.scene.add(this.instance)
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.controls.update()
  }
}
