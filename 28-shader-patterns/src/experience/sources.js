// 资源清单：Resources 的唯一输入
// type 决定走哪个 loader：
//   'texture'      → TextureLoader（单张纹理）
//   'cubeTexture'  → CubeTextureLoader（环境贴图，6 张路径按顺序）
//   'gltfModel'    → GLTFLoader（支持 Draco 压缩，解码器在 /draco/）
// 加载完成后通过 resources.items[name] 访问。
// 本项目暂无资源（纯 shader 练习），清单保持为空。

export default []
