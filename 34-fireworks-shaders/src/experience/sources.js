// 资源清单：Resources 的唯一输入
// type 决定走哪个 loader：
//   'texture'      → TextureLoader（单张纹理）
//   'cubeTexture'  → CubeTextureLoader（环境贴图，6 张路径按顺序）
//   'gltfModel'    → GLTFLoader（支持 Draco 压缩，解码器在 /draco/）
// 加载完成后通过 resources.items[name] 访问。
// 课程目前只用到占位盒子，烟花粒子纹理（static/particles/1.png~8.png）在后续步骤登记：
// {
//   name: 'particleTexture',
//   type: 'texture',
//   path: 'particles/1.png',
// }

export default [{
  name: '1',
  type: 'texture',
  path: 'particles/1.png'
}, {
  name: '2',
  type: 'texture',
  path: 'particles/2.png'
}, {
  name: '3',
  type: 'texture',
  path: 'particles/3.png'
}, {
  name: '4',
  type: 'texture',
  path: 'particles/4.png'
}, {
  name: '5',
  type: 'texture',
  path: 'particles/5.png'
}, {
  name: '6',
  type: 'texture',
  path: 'particles/6.png'
}, {
  name: '7',
  type: 'texture',
  path: 'particles/7.png'
}, {
  name: '8',
  type: 'texture',
  path: 'particles/8.png'
},]
