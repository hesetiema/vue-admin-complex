<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="link(to)">
    <slot></slot>
  </component>
</template>

<script>
import { isExternal } from "@/utils/validate";

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    link(url) {
      let tolink = [
        {
          // template: "<a href={url} target='_blank' rel='noopener'></a>"
          is: "a",
          href: url,
          target: "_blank",
          rel: "noopener"
        },
        {
          // template: "<router-link to={url}></router-link>"
          is: "router-link",
          to: url
        }
      ];
      return isExternal(url) ? tolink[0] : tolink[1];
    }
  }
};
</script>

