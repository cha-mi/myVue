import compileUtil from "../Compile/compileUtil.js"

class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm
        this.expr = expr
        this.cb = cb
        // 保存旧值
        this.oldVal = this.getOldVal()
    }
    getOldVal() {
        Dep.target = this
        const oldVal = compileUtil.getVal(this.expr, this.vm)
        Dep.target = null
        return oldVal
    }
    update() {
        const newVal = compileUtil.getVal(this.expr, this.vm)
        if (newVal !== this.oldVal) {
            this.cb(newVal)
        }
    }
}

class Dep{
    constructor() {
        this.subs = [] //订阅器
    }
//    收集观察者
    addSub(watcher) {
        this.subs.push(watcher)
    }
//    通知观察者更新
    notify() {
        console.log(this.subs)
        this.subs.forEach(w => w.update())
    }
}

class Observer {
    constructor(data) {
        this.observe(data)
    }
    observe(data) {
        if (data && typeof data === 'object') {
            Object.keys(data).forEach(key => {
                this.defineReactive(data, key, data[key])
            })
        }
    }
    defineReactive(obj, key, value) {
        this.observe(value);
        const dep = new Dep()
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: false, // 是否可以更改
            get:() => {
                // 订阅数据变化 往Dep添加观察者
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set: (newVal) => {
                this.observe(newVal)
                if (newVal !== value) {
                    value = newVal
            //    告诉dep通知变化
                    dep.notify()
                }

            }
        })
    }
}
export {
    Watcher,
    Dep,
    Observer
}
