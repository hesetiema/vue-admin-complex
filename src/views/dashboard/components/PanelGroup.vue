<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <img src="../../../assets/peoples.png" alt="people" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">New Visits</div>
          <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <img src="@/assets/message.png" alt="message" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Messages</div>
          <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <img src="@/assets/money.png" alt="money" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Purchases</div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <img src="@/assets/shopping.png" alt="shopping" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Shoppings</div>
          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    }
  }
};
</script>
<style lang="scss" scoped>
.panel-group {
  margin-top: 1rem;

  .card-panel-col {
    margin-bottom: 2rem;
  }

  .card-panel {
    height: 6.75rem;
    cursor: pointer;
    overflow: hidden;
    box-shadow: 0.3rem 0.3rem 3rem rgba(0, 0, 0, 0.1);
    border-color: rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      margin: 1rem;
      padding: 1rem;
    }

    img {
      width: 3rem;
      height: 3rem;
    }

    .card-panel-description {
      font-weight: bold;
      margin: 1.5rem;
      margin-left: 0;

      .card-panel-text {
        line-height: 1rem;
        color: rgba(0, 0, 0, 0.5);
        font-size: 1rem;
        margin:0 0 .75rem;
      }

      .card-panel-num {
        font-size: 1.25rem;
      }
    }
  }
}
</style>
