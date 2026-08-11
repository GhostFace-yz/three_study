import * as THREE from 'three'
import vertexShader from '/shader/galaxy/vertex.glsl'
import fragmentShader from '/shader/galaxy/fragment.glsl'
import { GUI } from 'lil-gui';


/**
 * 银河：30 课《Animated Galaxy》的场景对象。
 * 忠实迁移自原 script.js：参数、generateGalaxy 生成逻辑、GUI 控制全部保留。
 * PointsMaterial 不受光照影响，因此本项目不需要 Environment（灯光）。
 */
export default class Galaxy {
  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene
    this.time = experience.time
    this.debug = experience.debug
    this.renderer = experience.renderer
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('galaxy')
    }

    // 原代码是 let geometry/material/points = null，generateGalaxy 据此判断是否首次生成
    this.geometry = null
    this.material = null
    this.points = null

    this.setParameters()
    this.generateGalaxy()
  }

  setParameters() {
    this.parameters = {
      count: 200000,
      size: 0.005,
      radius: 5,
      branches: 3,
      spin: 1, // 原代码已声明但暂未使用（旋转动画是课程下一步）
      randomness: 0.5,
      randomnessPower: 3,
      insideColor: '#ff6030',
      outsideColor: '#1b3984',
    }

    if (this.debug.active) {
      this.debugFolder
        .add(this.parameters, 'count')
        .min(100)
        .max(1000000)
        .step(100)
        .onFinishChange(() => {
          this.generateGalaxy()
        })
      this.debugFolder
        .add(this.parameters, 'radius')
        .min(0.01)
        .max(20)
        .step(0.01)
        .onFinishChange(() => {
          this.generateGalaxy()
        })
      this.debugFolder
        .add(this.parameters, 'branches')
        .min(2)
        .max(20)
        .step(1)
        .onFinishChange(() => {
          this.generateGalaxy()
        })
      this.debugFolder
        .add(this.parameters, 'randomness')
        .min(0)
        .max(2)
        .step(0.001)
        .onFinishChange(() => {
          this.generateGalaxy()
        })
      this.debugFolder
        .add(this.parameters, 'randomnessPower')
        .min(1)
        .max(10)
        .step(0.001)
        .onFinishChange(() => {
          this.generateGalaxy()
        })
      this.debugFolder
        .addColor(this.parameters, 'insideColor')
        .onFinishChange(() => {
          this.generateGalaxy()
        })
      this.debugFolder
        .addColor(this.parameters, 'outsideColor')
        .onFinishChange(() => {
          this.generateGalaxy()
        })
    }
  }

  generateGalaxy() {
    // 重新生成前清理上一次的几何体/材质/点云
    if (this.points !== null) {
      this.geometry.dispose()
      this.material.dispose()
      this.scene.remove(this.points)
    }

    /**
     * Geometry
     */
    this.geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(this.parameters.count * 3)
    const colors = new Float32Array(this.parameters.count * 3)
    const scales = new Float32Array(this.parameters.count)

    const insideColor = new THREE.Color(this.parameters.insideColor)
    const outsideColor = new THREE.Color(this.parameters.outsideColor)

    for (let i = 0; i < this.parameters.count; i++) {
      const i3 = i * 3

      // Position
      const radius = Math.random() * this.parameters.radius

      const branchAngle =
        ((i % this.parameters.branches) / this.parameters.branches) *
        Math.PI *
        2

      const randomX =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        this.parameters.randomness *
        radius
      const randomY =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        this.parameters.randomness *
        radius
      const randomZ =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        this.parameters.randomness *
        radius

      positions[i3] = Math.cos(branchAngle) * radius + randomX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = Math.sin(branchAngle) * radius + randomZ

      // Color
      const mixedColor = insideColor.clone()
      mixedColor.lerp(outsideColor, radius / this.parameters.radius)

      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b

      // scale
      scales[i] = Math.random()
    }

    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    )
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

    this.setMaterial()

    /**
     * Points
     */
    this.points = new THREE.Points(this.geometry, this.material)
    this.scene.add(this.points)
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uSize: { value: 8.0 * this.renderer.getPixelRatio() }
      }
    })
    if(this.debug.active) {
      this.debugFolder.add(this.material.uniforms.uSize, 'value').min(0).max(10).name('点大小').step(1)
    }
  }


  update() {
    // 每帧执行（time.delta 单位是毫秒）：
    // 课程下一步的旋转动画：this.points.rotation.y = this.time.elapsed * 0.001 * this.parameters.spin
  }

  destroy() {
    // 释放自己创建的资源
    this.scene.remove(this.points)
    if (this.geometry) {
      this.geometry.dispose()
    }
    if (this.material) {
      this.material.dispose()
    }
  }
}
