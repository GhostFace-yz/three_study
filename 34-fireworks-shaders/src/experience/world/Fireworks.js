import * as THREE from 'three'
import fireworkVertex from '/shader/firework/vertex.glsl'
import fireworkFragment from '/shader/firework/fragment.glsl'
import gsap from 'gsap'

/**
 * 烟花：34 课《Fireworks Shaders》的场景对象。
 * 目前是课程的占位盒子，后续课程会替换成粒子系统
 * （BufferGeometry 位置/颜色 + 自定义 ShaderMaterial）。
 * MeshBasicMaterial 不受光照影响，因此不需要 Environment（灯光）。
 */
export default class Fireworks {
  constructor(experience) {
    this.experience = experience
    this.sizes = experience.sizes
    this.scene = experience.scene
    this.resources = experience.resources
    this.time = experience.time
    this.debug = experience.debug
    this.resolution = new THREE.Vector2(this.sizes.width * this.sizes.pixelRatio, this.sizes.height * this.sizes.pixelRatio)
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('fireworks')
    }
    this.sizes.on('resize', () => {
      this.resolution.set(this.sizes.width * this.sizes.pixelRatio, this.sizes.height * this.sizes.pixelRatio)
    })
    // this.setGeometry()
    // this.setMaterial()
    // this.setMesh()
    this.createFirework(100, new THREE.Vector3(), .5, this.resources.items['7'], 1, new THREE.Color('#8affff'))
    console.log(this.scene);
    
    this.setAnimate()
  }

  createFirework(count, position, size, texture, radius, color) {
    const positionsArray = new Float32Array(count * 3)
    const sizesArray = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      const spherical = new THREE.Spherical(
        radius * .75 + Math.random() * .25,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2,
      )
      const position = new THREE.Vector3()
      position.setFromSpherical(spherical)

      positionsArray[i3] = position.x
      positionsArray[i3 + 1] = position.y
      positionsArray[i3 + 2] = position.z
      sizesArray[i] = Math.random()
    }

    console.log(color);

    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3))
    this.geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizesArray, 1))
    texture.flipY = false
    this.material = new THREE.ShaderMaterial({
      vertexShader: fireworkVertex,
      fragmentShader: fireworkFragment,
      uniforms: {
        uSize: new THREE.Uniform(size),
        uResolution: new THREE.Uniform(this.resolution),
        uTexture: new THREE.Uniform(texture),
        uColor: new THREE.Uniform(color),
        uProgress: new THREE.Uniform(0)
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    this.firework = new THREE.Points(
      this.geometry,
      this.material
    )

    this.firework.position.copy(position)
    this.scene.add(this.firework)
    
  }


  setAnimate() {
    gsap.to(
      this.material?.uniforms.uProgress, { value: 1, duration: 3, ease: 'linear', onComplete: this.destroy }
    )
  }

  setGeometry() {

  }

  setMaterial() {

  }

  setMesh() {

  }

  update() {
    // 每帧执行（time.delta 单位是毫秒）：
    // 后续粒子系统在这里更新 uniform / 位置
  }

  destroy() {
    console.log('销毁');
    
    // 释放自己创建的资源
    this.scene.remove(this.firework)
    this.geometry.dispose()
    this.material.dispose()
  }
}
