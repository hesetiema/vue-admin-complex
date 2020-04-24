<template>
  <div v-if="!item.meta.hidden">
    <tolink
      v-if="oneShowChild(item.children,item)&&(!oneChild.children)&&(oneChild.meta)"
      :to="resolvePath(oneChild.path)"
    >
      <el-menu-item :index="resolvePath(oneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
        <item :icon="oneChild.meta.icon||(item.meta&&item.meta.icon)" :title="oneChild.meta.title"></item>
      </el-menu-item>
    </tolink>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item  v-if="item.meta" :icon="item.meta.icon" :title="item.meta.title"></item>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import item from "./Item";
import tolink from "./Link";
import { isExternal } from "@/utils/validate";
export default {
  name: "SidebarItem",
  components: { item, tolink },
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      required: true,
      default: ""
    }
  },
  data() {
    //fix infinite update loop in render function
    this.oneChild = null;
    return {};
  },
  methods: {
    //函数参数 children 的默认值为 []
    //数组 filter 方法返回 true 表示该元素通过测试，保留该元素
    oneShowChild(children = [], parent) {
      const showChildren = children.filter(item => item.meta.hidden !== true);
      if (showChildren.length === 1) {
        this.oneChild = showChildren[0];
        return true;
      } else if (showChildren.length === 0) {
        this.oneChild = { ...parent, path: "" };
        return true;
      }
      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    }
  }
};
</script>
