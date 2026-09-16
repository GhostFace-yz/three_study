import * as THREE from 'three'
import halftoneVertexShader from '../shaders/halftone/vertex.glsl'
import halftoneFragmentShader from '../shaders/halftone/fragment.glsl'

/**
 * halftone 着色器材质（不是场景对象，是被场景对象共用的资源）。
 * 由 World 创建一次后注入给三个物体：TorusKnot / Sphere / Suzanne，
 * 对象自己不 new 材质，销毁也由这里统一负责。
 * 后续往着色器里加光照、网点、uShadeColor 之类的 uniform，都加在这个文件。
 */
export default class HalftoneMaterial {
  constructor(experience) {
    this.debug = experience.debug
    this.sizes = experience.sizes
    this.setParameters()
    this.setInstance()
    this.setDebug()
    this.sizes.on('resize,halftoneMaterial', () => {
      this.instance.uniforms.uResolution.value.set(
        this.sizes.width * this.sizes.pixelRatio, this.sizes.height * this.sizes.pixelRatio
      )
    })
  }

  setParameters() {
    this.parameters = {
      color: '#ff794d',
    }
  }

  setInstance() {
    this.instance = new THREE.ShaderMaterial({
      vertexShader: halftoneVertexShader,
      fragmentShader: halftoneFragmentShader,
      uniforms: {
        uColor: new THREE.Uniform(new THREE.Color(this.parameters.color)),
        uResolution: new THREE.Uniform(
          new THREE.Vector2(
            this.sizes.width * this.sizes.pixelRatio,
            this.sizes.height * this.sizes.pixelRatio
          )
        )
      },
    })
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('material')
      this.debugFolder
        .addColor(this.parameters, 'color')
        .name('基色')
        .onChange(() => {
          this.instance.uniforms.uColor.value.set(this.parameters.color)
        })
    }
  }

  destroy() {
    this.instance.dispose()

    if (this.debug.active) {
      this.debugFolder.destroy()
    }
  }
}
