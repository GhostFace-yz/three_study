import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three'
import Environment from './Environment.js'
export default class World {
  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene

    const test = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial()
    )
    this.scene.add(test)

    this.environment = new Environment(experience)
    console.log(test);
  }
}