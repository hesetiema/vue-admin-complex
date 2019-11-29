<template>
  <div class="tab-item">
    <div :style="{ backgroundImage: `url(${image})` }" class="tab-thumb"></div>
  </div>
</template>

<script>
export default {
  name: "TabThumb",
  props: {
    image: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-item {
  position: relative;
  display: inline-block;
  z-index: 1;
  width:100%;
  height:100%;
  border-radius: 50%;
}
.tab-thumb {
  position: absolute;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
  background-color: pink;
  transform-origin: 95% 40%;
  transition: all 0.3s ease-in-out;
}
.tab-item:hover .tab-thumb {
  transform: rotate(-110deg);
}
</style>
