import EventEmitter from './EventEmitter.js'
import { TextureLoader, CubeTextureLoader } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

/**
 * 资源中心：持有所有 loader，统一加载 sources.js 声明的资源。
 * 加载完成存到 this.items[name]，全部加载完广播 'ready'。
 * 场景对象通过 this.resources.items.xxx 取资源，绝不自己 new loader
 * （否则同一个资源会被重复加载）。
 */
export default class Resources extends EventEmitter {
  constructor(sources) {
    super()

    this.sources = sources
    this.items = {}
    this.toLoad = this.sources.length
    this.loaded = 0

    this.setLoaders()
    this.startLoading()
  }

  setLoaders() {
    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new TextureLoader(),
      cubeTextureLoader: new CubeTextureLoader(),
    }

    // Draco 解码器：解码器文件放在 static/draco/，以 /draco/ 根路径引用
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setPath('/draco/')
    this.loaders.gltfLoader.setDRACOLoader(this.dracoLoader)
  }

  startLoading() {
    for (const source of this.sources) {
      switch (source.type) {
        case 'cubeTexture':
          this.loaders.cubeTextureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file)
          })
          break
        case 'gltfModel':
          this.loaders.gltfLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file)
          })
          break
        case 'texture':
          this.loaders.textureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file)
          })
          break
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file
    this.loaded++

    if (this.loaded === this.toLoad) {
      this.trigger('ready')
    }
  }
}
