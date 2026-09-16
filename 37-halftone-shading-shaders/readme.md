# Three.js Journey — Halftone Shading Shaders

## Setup

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server (default http://localhost:5173)
npm run dev

# Build for production in the dist/ directory
npm run build
```

调试面板（lil-gui）只在 URL 带 `#debug` 时出现：http://localhost:5173/#debug

## 目录结构

```
src/
├── index.html
├── script.js                     # 唯一入口：new Experience(canvas)
├── style.css
└── experience/
    ├── Experience.js             # 组合根：创建各模块、订阅 resize/tick、destroy()
    ├── Camera.js                 # 相机 + OrbitControls
    ├── Renderer.js               # 渲染器与清屏色
    ├── sources.js                # 资源清单（Resources 的输入）
    ├── shaders/                  # glsl（vite-plugin-glsl 负责 import）
    │   ├── halftone/             # 顶点 / 片元着色器
    │   └── includes/             # 复用的光照函数
    ├── utils/
    │   ├── Debug.js              # lil-gui 包装（#debug 门控）
    │   ├── EventEmitter.js       # 事件总线
    │   ├── Resources.js          # 统一加载器（sources.js → items[name]）
    │   ├── Sizes.js              # 窗口尺寸，广播 resize
    │   └── Time.js               # rAF 循环，广播 tick（单位毫秒）
    └── world/
        ├── World.js              # 场景对象管理器（resources ready 后创建对象）
        ├── HalftoneMaterial.js   # 三个物体共用的 halftone 着色器材质
        ├── TorusKnot.js
        ├── Sphere.js
        └── Suzanne.js            # 用 resources.items.suzanneModel

static/                           # publicDir，代码里按 models/xxx.glb 引用
└── models/suzanne.glb
```

约定：场景对象只有构造函数（取依赖 → 开 debug 面板 → setXxx()）和 `resize` / `update` / `destroy`
三个生命周期方法；材质等共享资源由 World 创建后注入；浏览器控制台可通过 `window.experience` 访问实例。
