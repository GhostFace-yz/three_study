import EventEmitter from './EventEmitter.js'
import { TextureLoader, CubeTextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

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
      cubeTextureLoader: new CubeTextureLoader()
    }
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setPath('/draco/')
  }
  startLoading() {
    for (const source of this.sources) {
      switch (source.type) {
        case 'cubeTexture':
          this.loaders.cubeTextureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          })
          break;
        case 'gltfModel':
          this.loaders.gltfLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          })
          break;
        case 'texture':
          this.loaders.textureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          })
          break;
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