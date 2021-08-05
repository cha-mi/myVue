import { Watcher } from "../Obesrver/Observer.js"

const compileUtil = {
    getVal(expr, vm){
        return expr.split('.').reduce((data, currentVal) => {
            return data[currentVal]
        }, vm.$data)
    },
    setVal(expr, vm, inputVal) {
        expr.split('.').reduce((data, currentVal) => {
            if (typeof data[currentVal] !== "object") {
                data[currentVal] = inputVal
            }
            return data[currentVal]
        }, vm.$data)
    },
    getContentVal(expr, vm) {
        return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
            return this.getVal(args[1], vm)
        })
    },
    text(node, expr, vm) { //expr:msg {{}}
        let value
        if (expr.indexOf('{{') !== - 1 && expr.indexOf('}}') !== - 1) {
            //     {{}}
            value = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
                new Watcher(vm, args[1], () => {
                    this.updater.textUpdater(node, this.getContentVal(expr, vm))
                })
                return this.getVal(args[1], vm)
            })
        } else {
            value = this.getVal(expr, vm)
            new Watcher(vm, expr, (newVal) => {
                this.updater.textUpdater(node, newVal)
            })
        }
        this.updater.textUpdater(node, value)
    },
    html(node, expr, vm) {
        const value = this.getVal(expr, vm)
        new Watcher(vm, expr, (newVal) => {
            this.updater.htmlUpdater(node, newVal)
        })
        this.updater.htmlUpdater(node, value)
    },
    model(node, expr, vm) {
        const value = this.getVal(expr, vm)
        // 数据驱动视图
        new Watcher(vm, expr, (newVal) => {
            this.updater.modelUpdater(node, newVal)
        })
        //视图驱动数据
        node.addEventListener('input', (e) => {
            this.setVal(expr, vm, e.target.value)
        })
        this.updater.modelUpdater(node, value)
    },
    on(node, expr, vm, eventName) {
        let fn = vm.$method && vm.$method[expr]
        node.addEventListener(eventName, fn.bind(vm), false)
    },
//    更新函数
    updater: {
        textUpdater(node, value) {
            node.textContent = value
        },
        htmlUpdater(node, value) {
            node.innerHTML = value
        },
        modelUpdater(node, value) {
            node.value = value
        }
    }
}
export default compileUtil
