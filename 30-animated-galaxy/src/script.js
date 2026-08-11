// 唯一入口：只负责创建 Experience，业务代码永不回流到这里
import Experience from './experience/Experience.js'

const experience = new Experience(document.querySelector('canvas.webgl'))

// 全局实例已挂到 window.experience，浏览器控制台可调试：
// window.experience.galaxy.parameters.count
// window.experience.galaxy.generateGalaxy()
// window.experience.destroy()
