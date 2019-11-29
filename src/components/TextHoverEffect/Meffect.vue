<template>
  <a :class="className" class="link-meffect" href="#">
    {{ text }}
    <span :data-letters="text" class="span" />
    <span :data-letters="text" class="span" />
  </a>
</template>

<script>
export default {
  props: {
    className: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: "vue-cli-crash"
    }
  }
};
</script>

<style lang="scss" scoped>
.link-meffect {
  position: relative;
  overflow: hidden;
  display: inline-block;
  line-height: 1rem;
  font-weight: 800;
  color: #4dd9d5;
  text-decoration: none;
  outline: none;
  transition: color 0.5s 0.25s;

  &::before {
    content: "";
    width: 100%;
    height: 100%;
    background: #3888fa;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate3d(-100%, 0, 0);
    transition: transform 0.4s;
    transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
  }

  .span {
    position: absolute;
    height: 50%;
    width: 100%;
    left: 0;
    top: 0;
    overflow: hidden;

    &::before {
      content: attr(data-letters);
      position: absolute;
      left: 0;
      width: 100%;
      color: #3888fa;
      transition: transform 0.5s;
    }

    &:first-child::before {
      top: 0;
      transform: translate3d(0, 100%, 0);
    }

    &:nth-child(2) {
      top: 50%;
    }

    &:nth-child(2)::before {
      bottom: 0;
      transform: translate3d(0, -100%, 0);
    }
  }

  &:hover {
    transition: none;
    color: transparent;

    &::before {
      transform: translate3d(100%, 0, 0);
      display: inline-block;
    }

    .span::before {
      transform: translate3d(0, 0, 0);
      transition-delay: 0.3s;
      transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
    }
  }
}
</style>
