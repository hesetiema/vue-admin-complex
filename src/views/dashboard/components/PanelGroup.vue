<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg
            t="1575019339065"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3010"
            width="200"
            height="200"
          >
            <path
              d="M513.022795 61.718667c-147.677411 0-267.395026 119.716592-267.395026 267.395026 0 147.678434 119.716592 267.395026 267.395026 267.395026S780.417821 476.792127 780.417821 329.11267C780.417821 181.435259 660.700205 61.718667 513.022795 61.718667zM513.021771 510.98795c-100.446713 0-181.874257-81.427544-181.874257-181.874257 0-100.447736 81.427544-181.874257 181.874257-181.874257 100.446713 0 181.875281 81.426521 181.875281 181.874257C694.897052 429.560406 613.468484 510.98795 513.021771 510.98795zM156.930657 959.469288c-0.032746-2.02103-0.056282-4.043083-0.056282-6.072299 0-197.981097 158.995177-358.477464 355.123067-358.477464 196.130959 0 355.126136 160.496367 355.126136 358.477464 0 2.028193-0.022513 4.051269-0.056282 6.072299l92.433202 0c0.026606-2.02103 0.042979-4.043083 0.042979-6.070252 0-244.530272-200.372563-442.760033-447.543989-442.760033-247.173472 0-447.546036 198.22976-447.546036 442.760033 0 2.026146 0.016373 4.049223 0.042979 6.070252L156.930657 959.469288z"
              p-id="3011"
            ></path>
          </svg>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">New Visits</div>
          <count-to
            :start-val="0"
            :end-val="102400"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg
            t="1575020111989"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2973"
            width="200"
            height="200"
          >
            <path
              d="M288.010553 489.070778h447.978894c17.672498 0 31.998785 14.326287 31.998785 31.998785s-14.326287 31.998785-31.998785 31.998785H288.010553c-17.672498 0-31.998785-14.326287-31.998785-31.998785s14.326287-31.998785 31.998785-31.998785z m0-191.990662h447.978894c17.672498 0 31.998785 14.326287 31.998785 31.998785s-14.326287 31.998785-31.998785 31.998784H288.010553c-17.672498 0-31.998785-14.326287-31.998785-31.998784s14.326287-31.998785 31.998785-31.998785z m15.999392 573.115939l184.698583-143.654794a63.99757 63.99757 0 0 1 39.289841-13.481036h351.983563c17.672498 0 31.998785-14.326287 31.998785-31.998785V169.087023c0-17.672498-14.326287-31.998785-31.998785-31.998785H144.017044c-17.672498 0-31.998785 14.326287-31.998784 31.998785v511.975441c0 17.672498 14.326287 31.998785 31.998784 31.998784h95.995332c35.344996 0 63.996546 28.652574 63.996546 63.996547v93.13826z m223.989447-93.13826L317.478701 940.795996c-20.924565 16.274662-51.080376 12.504802-67.355037-8.419763a47.994084 47.994084 0 0 1-10.110265-29.468149V777.057795h-95.995331c-53.016471 0-95.995331-42.97886-95.995331-95.995331V169.087023c0-53.016471 42.97886-95.995331 95.995331-95.995331h735.964888c53.016471 0 95.995331 42.97886 95.995331 95.995331v511.975441c0 53.016471-42.97886 95.995331-95.995331 95.995331H527.999392z"
              p-id="2974"
            ></path>
          </svg>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Messages</div>
          <count-to
            :start-val="0"
            :end-val="81212"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg
            t="1575020014475"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5333"
            width="200"
            height="200"
          >
            <path
              d="M512 149.333333c200.298667 0 362.666667 162.368 362.666667 362.666667s-162.368 362.666667-362.666667 362.666667S149.333333 712.298667 149.333333 512 311.701333 149.333333 512 149.333333z m0 64c-164.949333 0-298.666667 133.717333-298.666667 298.666667s133.717333 298.666667 298.666667 298.666667 298.666667-133.717333 298.666667-298.666667-133.717333-298.666667-298.666667-298.666667z m84.053333 105.386667l45.226667 45.226667L557.269333 448H672v64h-128v53.333333h128v64h-128v85.333334h-64v-85.333334h-128v-64h128V512h-128v-64h114.752l-84.053333-84.053333 45.269333-45.226667L512 402.730667l84.053333-84.053334z"
              p-id="5334"
            ></path>
          </svg>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Purchases</div>
          <count-to
            :start-val="0"
            :end-val="9280"
            :duration="3200"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg
            t="1575019678033"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1971"
            width="200"
            height="200"
          >
            <path
              d="M384 768a64 64 0 1 0 0.032 128.032A64 64 0 0 0 384 768M704 768a64 64 0 1 0 0.032 128.032A64 64 0 0 0 704 768M312.672 512l-51.456-192h560.96l-51.456 192H312.672z m583.36-224a32 32 0 0 0-32-32H244.064L209.824 128H96v64h64.672l145.728 544H800v-64H355.52l-25.664-96H819.84l12.16-45.376 64-238.88-0.768-0.192C895.424 290.336 896 289.28 896 288z"
              fill="#181818"
              p-id="1972"
            ></path>
          </svg>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Shoppings</div>
          <count-to
            :start-val="0"
            :end-val="13600"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";

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
        margin: 0 0 0.75rem;
      }

      .card-panel-num {
        font-size: 1.25rem;
      }
    }
  }
}
</style>
