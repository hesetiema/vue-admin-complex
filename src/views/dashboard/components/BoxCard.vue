<template>
  <el-card class="box-card">
    <div slot="header" class="box-card-header"></div>
    <div class="box-card-body">
      <tab-thumb :image="avatar" class="tabThumb" />
      <meffect class="meffect-text" text="vue-cli-crash" />
      <div class="progress-item f-item">
        <span>Vue</span>
        <el-progress :percentage="70" />
      </div>
      <div class="progress-item">
        <span>JavaScript</span>
        <el-progress :percentage="80" />
      </div>
      <div class="progress-item">
        <span>Css</span>
        <el-progress :percentage="80" />
      </div>
      <div class="progress-item">
        <span>ESLint</span>
        <el-progress :percentage="60" status="success" />
      </div>
    </div>
  </el-card>
</template>

<script>
import TabThumb from "@/components/TabThumb";
import Meffect from "@/components/TextHoverEffect/Meffect";
import { mapGetters } from "vuex";

export default {
  components: {
    TabThumb,
    Meffect
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  margin-left: 0.5rem;
  /deep/.el-card__header {
    padding: 0;
  }
  .box-card-header {
    position: relative;
    height: 14rem;
    transition: all 0.2s linear;
    background: no-repeat top center/cover
      url(https://cn.bing.com/th?id=OHR.HairyHighlanders_ZH-CN5546635143_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp);
    &:hover {
      transform: scale(1.1, 1.1);
      filter: contrast(130%);
    }
  }
  .box-card-body {
    position: relative;
  }
  .tabThumb {
    position: absolute;
    z-index: 1;
    top: -3rem;
    left: 0px;
    width: 4.5rem;
    height: 4.5rem;
    box-sizing: border-box;
    border: 0.375rem solid #fff;
    background-color: #fff;
  }
  .f-item {
    padding-top: 2rem;
  }
  .progress-item {
    margin-bottom: 0.8rem;
    font-size: 0.9rem;
  }
}
</style>
