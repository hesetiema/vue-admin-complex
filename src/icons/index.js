import Vue from "vue";
import SvgIcon from "@/components/SvgIcon";

// register globally
Vue.component("svg-icon",SvgIcon )

// 全局导入基础组件
// require.context执行后，返回一个方法 webpackContext,有静态方法 keys 与 resolve，id属性
// keys 返回匹配成功模块的名字组成的数组, resolve 返回传入匹配文件相对于整个工程的相对路径
const req = require.context("./svg",false,/\.svg$/)
const requireAll = requireContext=>requireContext.keys().map(requireContext)
requireAll(req)
