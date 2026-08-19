/**
 * 事件总线（来自 Three.js Journey 课程，模式通用可复用）。
 *
 * 用法：
 *   const emitter = new EventEmitter()
 *   emitter.on('resize', callback)              // 订阅
 *   emitter.on('resize.myObject', callback)     // 订阅 + 命名空间（便于精确移除）
 *   emitter.off('resize.myObject')              // 只移除该命名空间下的订阅
 *   emitter.off('resize')                       // 移除所有命名空间下的 resize
 *   emitter.trigger('resize')                   // 触发（参数以数组传入）
 *
 * 说明：off 移除的是"名字"下的所有回调（不区分具体回调函数），
 * 命名空间用于把同一事件的不同订阅者分组清理。
 */
export default class EventEmitter {
  constructor() {
    this.callbacks = {}
    this.callbacks.base = {}
  }

  on(_names, callback) {
    // 参数校验
    if (typeof _names === 'undefined' || _names === '') {
      console.warn('wrong names')
      return false
    }

    if (typeof callback === 'undefined') {
      console.warn('wrong callback')
      return false
    }

    // 解析名字（支持 'a,b/c.d' 这类写法）
    const names = this.resolveNames(_names)

    // 逐个注册
    names.forEach((_name) => {
      const name = this.resolveName(_name)

      // 创建命名空间容器
      if (!(this.callbacks[name.namespace] instanceof Object))
        this.callbacks[name.namespace] = {}

      // 创建回调数组
      if (!(this.callbacks[name.namespace][name.value] instanceof Array))
        this.callbacks[name.namespace][name.value] = []

      // 加入回调
      this.callbacks[name.namespace][name.value].push(callback)
    })

    return this
  }

  off(_names) {
    // 参数校验
    if (typeof _names === 'undefined' || _names === '') {
      console.warn('wrong name')
      return false
    }

    const names = this.resolveNames(_names)

    names.forEach((_name) => {
      const name = this.resolveName(_name)

      // 移除整个命名空间（'event.namespace' 写法，value 为空）
      if (name.namespace !== 'base' && name.value === '') {
        delete this.callbacks[name.namespace]
      }
      // 移除具体事件
      else {
        // 不带命名空间：从所有命名空间里移除该事件
        if (name.namespace === 'base') {
          for (const namespace in this.callbacks) {
            if (this.callbacks[namespace] instanceof Object && this.callbacks[namespace][name.value] instanceof Array) {
              delete this.callbacks[namespace][name.value]

              // 命名空间空了就删掉
              if (Object.keys(this.callbacks[namespace]).length === 0)
                delete this.callbacks[namespace]
            }
          }
        }
        // 带命名空间：只移除该命名空间下的
        else if (this.callbacks[name.namespace] instanceof Object && this.callbacks[name.namespace][name.value] instanceof Array) {
          delete this.callbacks[name.namespace][name.value]

          if (Object.keys(this.callbacks[name.namespace]).length === 0)
            delete this.callbacks[name.namespace]
        }
      }
    })

    return this
  }

  trigger(_name, _args) {
    // 参数校验
    if (typeof _name === 'undefined' || _name === '') {
      console.warn('wrong name')
      return false
    }

    let finalResult = null
    let result = null
    
    // 参数以数组传入，apply 展开
    const args = !(_args instanceof Array) ? [] : _args

    // 解析名字（trigger 只支持单个事件）
    let name = this.resolveNames(_name)
    name = this.resolveName(name[0])

    // 不带命名空间：找所有命名空间下的该事件
    if (name.namespace === 'base') {
      for (const namespace in this.callbacks) {
        if (this.callbacks[namespace] instanceof Object && this.callbacks[namespace][name.value] instanceof Array) {
          this.callbacks[namespace][name.value].forEach(function (callback) {
            result = callback.apply(this, args)

            if (typeof finalResult === 'undefined') {
              finalResult = result
            }
          })
        }
      }
    }
    // 带命名空间：只触发该命名空间下的
    else if (this.callbacks[name.namespace] instanceof Object) {
      if (name.value === '') {
        console.warn('wrong name')
        return this
      }

      this.callbacks[name.namespace][name.value].forEach(function (callback) {
        result = callback.apply(this, args)

        if (typeof finalResult === 'undefined')
          finalResult = result
      })
    }
    
    return finalResult
  }

  resolveNames(_names) {
    let names = _names
    names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '')
    names = names.replace(/[,/]+/g, ' ')
    names = names.split(' ')

    return names
  }

  resolveName(name) {
    const newName = {}
    const parts = name.split('.')

    newName.original = name
    newName.value = parts[0]
    newName.namespace = 'base' // 默认命名空间

    // 带命名空间
    if (parts.length > 1 && parts[1] !== '') {
      newName.namespace = parts[1]
    }

    return newName
  }
}
