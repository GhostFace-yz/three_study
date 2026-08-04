import { CircleGeometry, SRGBColorSpace, RepeatWrapping, MeshStandardMaterial, Mesh } from 'three'

export default class Floor {
  constructor(experience) {
    this.experience = experience
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.setGeometry()
    this.setTextures()
    this.setMaterial()
    this.setMesh()
  }
  setGeometry() {
    this.geometry = new CircleGeometry(5, 64)
  }
  setTextures() {
    this.textures = {
      color: this.resources.items.grassColorTexture,
      normal: this.resources.items.grassNormalTexture
    }
    this.textures.color.colorSpace = SRGBColorSpace
    this.textures.color.repeat.set(1.5, 1.5)
    this.textures.color.wrapS = RepeatWrapping
    this.textures.color.wrapT = RepeatWrapping
    this.textures.normal.repeat.set(1.5, 1.5)
    this.textures.normal.wrapS = RepeatWrapping
    this.textures.normal.wrapT = RepeatWrapping
  }
  setMaterial() {
    this.material = new MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal
    })
  }
  setMesh() {
    this.mesh = new Mesh(
      this.geometry,
      this.material
    )
    this.mesh.rotation.x = - Math.PI * .5
    this.mesh.receiveShadow = true
    this.scene.add(this.mesh)
  }
}