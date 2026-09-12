import * as THREE from 'three'
import waterVertexShader from '/shader/water/vertex.glsl'
import waterFragmentShader from '/shader/water/fragment.glsl'
/**
 * 水面：Raging Sea 课程的水面平面。
 * 目前是纯色 MeshBasicMaterial，后续换成自定义 shader 材质时
 * 在此文件内替换 setMaterial，并可在 update() 里更新 uniform。
 */
export default class Water {
  constructor(experience) {
    this.experience = experience
    this.scene = experience.scene
    this.debug = experience.debug
    this.time = experience.time
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('water')
    }

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 512, 512)
  }

  setMaterial() {
    const debugObj = {
      depthColor: '#268ac0',
      surfaceColor: '#9bd8ff'
    }
    this.material = new THREE.ShaderMaterial({
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uBigWavesElevation: { value: .2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: .75 },
        uSmallWavesElevation: { value: .15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesIterations: { value: 4.0 },
        uSmallWavesSpeed: { value: .12 },
        uDepthColor: { value: new THREE.Color(debugObj.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObj.surfaceColor) },
        uColorOffset: { value: 0.008 },
        uColorMultiplier: { value: 5 }, 
      },
      side: THREE.DoubleSide
    })
    if (this.debug.active) {
      this.debugFolder.addColor(debugObj, 'depthColor').name('深处颜色').onChange(() => {this.material.uniforms.uDepthColor.value.set(debugObj.depthColor)})
      this.debugFolder.addColor(debugObj, 'surfaceColor').name('浅处颜色').onChange(() => {this.material.uniforms.uSurfaceColor.value.set(debugObj.surfaceColor)})
      this.debugFolder.add(this.material.uniforms.uBigWavesElevation, 'value').name('波浪幅度').min(0).max(1).step(.01)
      this.debugFolder.add(this.material.uniforms.uBigWavesFrequency.value, 'x').name('波浪频率x').min(0).max(10).step(.1)
      this.debugFolder.add(this.material.uniforms.uBigWavesFrequency.value, 'y').name('波浪频率z').min(0).max(10).step(.1)
      this.debugFolder.add(this.material.uniforms.uBigWavesSpeed, 'value').name('波浪速度').min(0).max(2).step(.1)
      this.debugFolder.add(this.material.uniforms.uColorOffset, 'value').name('偏移量').min(0).max(1).step(.001)
      this.debugFolder.add(this.material.uniforms.uColorMultiplier, 'value').name('倍数').min(0).max(10).step(.01)
      this.debugFolder.add(this.material.uniforms.uSmallWavesElevation, 'value').name('海浪高度').min(0).max(1).step(.01)
      this.debugFolder.add(this.material.uniforms.uSmallWavesFrequency, 'value').name('海浪振幅').min(0).max(30).step(.01)
      this.debugFolder.add(this.material.uniforms.uSmallWavesIterations, 'value').name('海浪柏林噪声倍数').min(0).max(10).step(1)
      this.debugFolder.add(this.material.uniforms.uSmallWavesSpeed, 'value').name('海浪速度').min(0).max(1).step(.01)
    }
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI * 0.5
    this.scene.add(this.mesh)
  }

  update() {
    // 每帧执行（time.delta 单位是毫秒）：
    // 后续 shader 材质可在这里更新 uniform：this.material.uniforms.uTime.value = this.time.elapsed * 0.001
    this.material.uniforms.uTime.value = this.time.elapsed * 0.001
  }

  destroy() {
    // 释放自己创建的资源
    this.scene.remove(this.mesh)
    this.geometry.dispose()
    this.material.dispose()
  }
}
