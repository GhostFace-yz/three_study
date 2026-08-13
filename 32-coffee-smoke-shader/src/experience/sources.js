// 资源清单：Resources 的唯一输入
// type 决定走哪个 loader：
//   'texture'      → TextureLoader（单张纹理）
//   'cubeTexture'  → CubeTextureLoader（环境贴图，6 张路径按顺序）
//   'gltfModel'    → GLTFLoader（支持 Draco 压缩，解码器在 /draco/）
// 加载完成后通过 resources.items[name] 访问。
// 注：perlin.png 是 bakedModel.glb 引用的外部贴图，随模型自动加载，无需单独登记。

export default [
  {
    name: 'bakedModel',
    type: 'gltfModel',
    path: 'bakedModel.glb',
  },
  {
    name: 'perlinPic',
    type: 'texture',
    path: 'perlin.png'
  }
]
