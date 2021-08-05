import Complie from './Compile/Compile.js'
import { Observer } from './Obesrver/Observer.js'

export default class MyVue{
    constructor(options) {
        this.$el = options.el
        this.$data = typeof (options.data) === 'object' ? options.data : options.data()
        this.$method = options.method
        this.$options = options
        if (this.$el) {
        //    1.实现一个数据的观察者
            new Observer(this.$data)
        //    2.实现一个指令解析器
            new Complie(this.$el, this)
            this.proxyData(this.$data)
        }
    }
    proxyData(data) {
        for (const key in data) {
            Object.defineProperty(this, key, {
                get() {
                    return data[key]
                },
                set(v) {
                    data[key] = v
                }
            })
        }
    }
}
