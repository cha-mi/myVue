import compileUtil from "./compileUtil.js"
export default class Compile{
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el)
        this.vm = vm
    //  获取文档碎片
        const fragment = this.node2Fragment(this.el)
    //    编译模板
        this.compile(fragment)
    //    追加子元素到根元素
        this.el.appendChild(fragment)
    }
    isElementNode(node) {
        return node.nodeType === 1 //判断是否是元素节点
    }
    node2Fragment(el) {
    //    创建文档碎片
        const f = document.createDocumentFragment()
        let firstChild;
        while (firstChild = el.firstChild) {
            f.appendChild(firstChild)
        }
        return f
    }
    compile(fragment) {
        //获取子节点
        const childNodes = fragment.childNodes;
        [...childNodes].forEach(child => {
            if(this.isElementNode(child)){
            //编译元素节点
                this.compileElement(child)
            }else {
            //编译文本节点
                this.compileText(child)
            }
            if (child.childNodes && child.childNodes.length) {
                this.compile(child)
            }
        })
    }
    isDirective(name) {
    //    判断是否是一个指令 v-text v-html v-model v-on:click
        return name.startsWith('v-')
    }
    isEventName(name) {
        return name.startsWith('@')
    }
    compileElement(node) {
    //    解析指令
        const attributes = node.attributes;
        [...attributes].forEach(attr => {
            const {name, value} = attr
            if (this.isDirective(name)) {
                const [, dirctive] = name.split('-')

                // on:click
                const [dirName, eventName] = dirctive.split(':')
                compileUtil[dirName](node, value, this.vm, eventName)
            //  删除节点指令标签
                node.removeAttribute('v-' + dirctive)
            }else if(this.isEventName(name)) {
                let [, eventName] = name.split('@')
                compileUtil['on'](node, value, this.vm, eventName)
            }
        })
    }
    compileText(node) {
    //    {{}} v-text
        const content = node.textContent
        if (/\{\{(.+?)\}\}/.test(content)) {
            compileUtil['text'](node, content, this.vm)
        }
    }
}
