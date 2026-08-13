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
      25,
      this.sizes.width / this.sizes.height,
      0.1,
      100,
    )
    this.instance.position.set(8, 10, 12)
    this.scene.add(this.instance)
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.target.y = 3 // 与原代码一致：看向咖啡杯（杯口在 y=3 附近）
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
