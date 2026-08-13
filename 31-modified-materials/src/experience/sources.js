// 资源清单：Resources 的唯一输入
// type 决定走哪个 loader：
//   'texture'      → TextureLoader（单张纹理）
//   'cubeTexture'  → CubeTextureLoader（环境贴图，6 张路径按顺序）
//   'gltfModel'    → GLTFLoader（支持 Draco 压缩，解码器在 /draco/）
// 加载完成后通过 resources.items[name] 访问。

export default [
  {
    name: 'environmentMapTexture',
    type: 'cubeTexture',
    path: [
      'textures/environmentMaps/0/px.jpg',
      'textures/environmentMaps/0/nx.jpg',
      'textures/environmentMaps/0/py.jpg',
      'textures/environmentMaps/0/ny.jpg',
      'textures/environmentMaps/0/pz.jpg',
      'textures/environmentMaps/0/nz.jpg',
    ],
  },
  {
    name: 'colorTexture',
    type: 'texture',
    path: 'models/LeePerrySmith/color.jpg',
  },
  {
    name: 'normalTexture',
    type: 'texture',
    path: 'models/LeePerrySmith/normal.jpg',
  },
  {
    name: 'leePerrySmithModel',
    type: 'gltfModel',
    path: 'models/LeePerrySmith/LeePerrySmith.glb',
  },
]
