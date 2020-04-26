<template>
  <div class="container">
    <div class="title">{{title}}</div>
    <div class="app-container">
      <div class="cbtn-nav nav-prev" @click="handlePrevBtn">
        <i class="el-icon-caret-left"></i>
      </div>
      <div class="cbtn-o" ref="outerBtn">
        <canvas ref="canvas" width="500" height="400"></canvas>
        <div
          ref="innerBtn"
          @mouseover="handleMouseover"
          @mouseout="handleMouseout"
          @mousedown="handleMousedown"
          @mouseup="handleMouseup"
          class="cbtn-i"
          data-mode="0"
        >Hover / Click / Hold</div>
      </div>
      <div class="cbtn-nav nav-next" @click="handleNextBtn">
        <i class="el-icon-caret-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dots: [],
      hoverFlag: false,
      clickFlag: false,
      emitter: undefined,
      anim: undefined,
      mode: 0,
      w: 500,
      h: 400,
      modeSets: [
        {
          name: "Fireflies",
          maxDots: 75,
          maxSpeed: 3, //变化速度
          minSpeed: 1,
          emitRate: 10, //emitRate 发射速率
          emitNum: 2,
          radius: 2, //圆弧半径
          trail: 0.2, //trail 落后,透明度
          maxTime: 1500,
          minTime: 750,
          glow: 10, //模糊半径
          hueMin: 15, //最小色相
          hueMax: 55
        },
        {
          name: "Hyper Jump", //超级跳
          maxDots: 100,
          maxSpeed: 3,
          minSpeed: 1,
          emitRate: 10,
          emitNum: 3,
          radius: 1.75,
          trail: 0.06,
          maxTime: 700,
          minTime: 300,
          glow: 7,
          hueMin: 170,
          hueMax: 230
        },
        {
          name: "Focus",
          maxDots: 75,
          maxSpeed: 2,
          minSpeed: 0.5,
          emitRate: 10,
          emitNum: 2,
          radius: 7,
          trail: 1,
          maxTime: 1000,
          minTime: 500,
          glow: 0,
          hueMin: 60,
          hueMax: 130
        },
        {
          name: "Vortex", //Vortex涡流
          maxDots: 150,
          maxSpeed: 2,
          minSpeed: -2,
          emitRate: 20,
          emitNum: 5,
          radius: 7,
          trail: 1,
          maxTime: 3000,
          minTime: 1500,
          glow: 0,
          hueMin: 260,
          hueMax: 330
        }
      ]
    };
  },
  computed: {
    title() {
      const mode = this.mode;
      return this.modeSets[mode].name;
    }
  },
  methods: {
    emitDots() {
      const modeSets = [...this.modeSets];
      const dots = this.dots;
      const mode = this.mode;
      const w = this.w;
      const h = this.h;
      if (dots.length < modeSets[mode].maxDots) {
        for (let i = 0; i < modeSets[mode].emitNum; i++) {
          let color =
            Math.random() * (modeSets[mode].hueMax - modeSets[mode].hueMin) +
            modeSets[mode].hueMin;
          dots.push({
            x: w / 2,
            y: h / 2,
            v:
              Math.random() *
                (modeSets[mode].maxSpeed - modeSets[mode].minSpeed) +
              modeSets[mode].minSpeed, //随机运动速度
            d: Math.random() * 360, //随机运动角度
            c: Math.random() * 10 + -5, //随机微调角度
            h: color, //随机色相旋转
            st: Date.now(),
            lt:
              Math.random() *
                (modeSets[mode].maxTime - modeSets[mode].minTime) +
              modeSets[mode].minTime //随机持续时间
          });
          this.dots = [...dots];
        }
      }
    },
    draw() {
      const modeSets = [...this.modeSets];
      const mode = this.mode;
      const dots = [...this.dots];
      const clickFlag = this.clickFlag;
      const w = this.w;
      const h = this.h;

      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgba(0,0,0," + modeSets[mode].trail + ")";
      ctx.fillRect(0, 0, w, h);
      ctx.fill();
      for (let i = 0; i < dots.length; i++) {
        let pct = (Date.now() - dots[i].st) / dots[i].lt; //进程 =（运行时间-开始时间）/持续时间
        switch (mode) {
          case 0:
            ctx.save(); //保存当前状态到栈中
            ctx.beginPath();
            ctx.fillStyle =
              "hsla(" + dots[i].h + ", 100%, 60%, " + (1 - pct) + ")";
            ctx.shadowColor = "hsla(" + dots[i].h + ", 100%, 60%, 1)";
            ctx.shadowBlur = modeSets[mode].glow;
            //绘制圆弧路径
            ctx.arc(
              dots[i].x,
              dots[i].y,
              Math.pow(modeSets[mode].radius, 2) / dots[i].v, //半径
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.closePath();
            ctx.restore(); //恢复到最近的保存状态

            dots[i].x += dots[i].v * Math.cos((dots[i].d * Math.PI) / 180);
            dots[i].y += dots[i].v * Math.sin((dots[i].d * Math.PI) / 180);
            dots[i].d += dots[i].c;
            if (clickFlag) dots[i].v = 1;
            break;
          case 1:
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle =
              "hsla(" + dots[i].h + ", 100%, 70%, " + (1 - pct) + ")";
            ctx.shadowColor = "hsla(" + dots[i].h + ", 100%, 70%, 1)";
            ctx.shadowBlur = modeSets[mode].glow;
            ctx.arc(
              dots[i].x,
              dots[i].y,
              Math.pow(modeSets[mode].radius, 2) / dots[i].v,
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.closePath();
            ctx.restore();

            dots[i].x += dots[i].v * Math.cos((dots[i].d * Math.PI) / 180);
            dots[i].y += dots[i].v * Math.sin((dots[i].d * Math.PI) / 180);
            if (clickFlag) dots[i].v = 3;
            break;
          case 2:
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle =
              "hsla(" + dots[i].h + ", 100%, 70%, " + (1 - pct) + ")";
            ctx.shadowColor = "hsla(" + dots[i].h + ", 100%, 70%, 1)";
            ctx.shadowBlur = modeSets[mode].glow;
            ctx.arc(
              dots[i].x,
              dots[i].y,
              modeSets[mode].radius,
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.closePath();
            ctx.restore();

            dots[i].x += dots[i].v * Math.cos((dots[i].d * Math.PI) / 180);
            dots[i].y += dots[i].v * Math.sin((dots[i].d * Math.PI) / 180);
            if (clickFlag) dots[i].v = 0.3;
            break;
          case 3:
            ctx.save();
            ctx.beginPath();
            ctx.translate(w / 2, h / 2);
            ctx.rotate((dots[i].d * Math.PI) / 180);
            ctx.fillStyle = "hsla(" + dots[i].h + ", 100%, 70%, " + pct + ")";
            ctx.shadowColor = "hsla(" + dots[i].h + ", 100%, 70%, 1)";
            ctx.shadowBlur = modeSets[mode].glow;
            ctx.rect(
              dots[i].x,
              dots[i].y,
              modeSets[mode].radius,
              modeSets[mode].radius
            );
            ctx.fill();
            ctx.closePath();
            ctx.restore();

            dots[i].x += dots[i].v;
            dots[i].y += dots[i].v;
            if (clickFlag) dots[i].v = 3;
            break;
        }
        if (
          dots[i].x > w ||
          dots[i].x < 0 ||
          dots[i].y > h ||
          dots[i].y < 0 ||
          dots[i].st + dots[i].lt < Date.now()
        ) {
          dots.splice(i, 1);
        }
      }
      this.dots = [...dots];
      this.anim = requestAnimationFrame(this.draw);
    },
    handleMouseover() {
      this.hoverFlag = true;
      const modeSets = [...this.modeSets];
      const mode = this.mode;
      this.emitter = setInterval(this.emitDots, modeSets[mode].emitRate);
      this.anim = requestAnimationFrame(this.draw);
    },
    handleMouseout() {
      this.hoverFlag = false;
      clearInterval(this.emitter);
      this.emitter = undefined;
      cancelAnimationFrame(this.anim);
      this.anim = undefined;
      this.$refs.canvas.getContext("2d").clearRect(0, 0, this.w, this.h);
      this.dots = [];
    },
    handleMousedown() {
      this.clickFlag = true;
    },
    handleMouseup() {
      this.clickFlag = false;
    },
    handleNextBtn() {
      if (this.modeSets.length <= this.mode + 1) {
        this.mode = 0;
      } else {
        this.mode += 1;
      }
      const outerBtn = this.$refs.outerBtn;
      const innerBtn = this.$refs.innerBtn;
      setTimeout(() => {
        innerBtn.setAttribute("data-mode", this.mode);
      }, 300);

      outerBtn.classList.add("next_anim");
      setTimeout(() => {
        outerBtn.classList.remove("next_anim");
      }, 600);
    },
    handlePrevBtn() {
      if (0 > this.mode - 1) {
        this.mode = this.modeSets.length - 1;
      } else {
        this.mode -= 1;
      }
      const outerBtn = this.$refs.outerBtn;
      const innerBtn = this.$refs.innerBtn;
      setTimeout(() => {
        innerBtn.setAttribute("data-mode", this.mode);
      }, 300);
      outerBtn.classList.add("prev_anim");
      setTimeout(function() {
        outerBtn.classList.remove("prev_anim");
      }, 600);
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  height: calc(100vh - 3rem);
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  background: #000;
}
.title {
  font-size: 24px;
  font-weight: 600;
  margin: 2rem;
  width: 200px;
  text-align: center;
  color: #fff;
}
.app-container {
  width: 640px;
  height: 480px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
/deep/ .cbtn-o {
  display: inline-block;
  width: 500px;
  height: 400px;
  position: relative;

  & > .cbtn-i {
    position: relative;
    z-index: 3;
    top: 185px;
    left: 125px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 250px;
    height: 30px;
    cursor: pointer;
    border-radius: 100px;
    font-weight: 600;
    color: #fff;

    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    transition: 250ms cubic-bezier(0, 0.5, 0.5, 1);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &[data-mode="0"] {
      background: #e96651;
      box-shadow: 0px 0px 0px #e96651;

      &:hover {
        transform: scale(0.9);
        background: #efaf60;
        box-shadow: 0px 0px 30px #efaf60;
      }

      &:active {
        transform: scale(1);
      }
    }
    &[data-mode="1"] {
      background: #3770a0;
      box-shadow: 0px 0px 0px #3770a0;

      &:hover {
        transform: scale(0.9);
        background: #77b6ea;
        box-shadow: 0px 0px 20px #77b6ea;
      }

      &:active {
        transform: scale(0.6);
      }
    }
    &[data-mode="2"] {
      background: #30a254;
      box-shadow: 0px 0px 0px #30a254;
      transition: 350ms cubic-bezier(0, 0.5, 0.5, 1);

      &:hover {
        transform: scale(0.9);
        background: #51e980;
        box-shadow: 0px 0px 30px #51e980;
      }

      &:active {
        transform: scale(0.9) rotateX(-360deg);
      }
    }
    &[data-mode="3"] {
      background: #8e54ff;
      box-shadow: 0px 0px 0px #8e54ff;

      &:hover {
        transform: scale(0.9);
        background: #a93ee0;
        box-shadow: 0px 0px 30px #a93ee0;
      }

      &:active {
        transform: scale(0.9) rotate(-360deg);
      }
    }
  }

  & > canvas {
    position: absolute;
    z-index: 2;
    top: 0px;
    left: 0px;
  }
}
.cbtn-nav {
  color: #fff;
  display: inline-block;
  position: relative;
  z-index: 1;
  font-size: 32px;
  padding: 10px;
  cursor: pointer;
  text-shadow: 2px 2px 4px #111;

  &.nav-next {
    margin-left: 20px;
    &::before {
      left: 24px;
    }
  }

  &.nav-prev {
    margin-right: 20px;
    &::before {
      left: 26px;
    }
  }

  &:hover::before {
    width: 50px;
    height: 50px;
  }

  &::before {
    content: "";
    position: absolute;
    border-radius: 100px;
    top: 32px;
    transform: translate(-50%, -50%);
    height: 0px;
    width: 0px;
    background: #333333;
    z-index: -1;
    transition: 150ms ease-in-out;
  }
}

.next_anim {
  animation: next 600ms ease;
  pointer-events: none;
}

.prev_anim {
  animation: prev 600ms ease;
  pointer-events: none;
}

@keyframes next {
  0% {
    left: 0px;
    opacity: 1;
  }
  50% {
    left: 300px;
    opacity: 0;
  }
  50.1% {
    left: -300px;
    opacity: 0;
  }
  100% {
    left: 0px;
    opacity: 1;
  }
}

@keyframes prev {
  0% {
    left: 0px;
    opacity: 1;
  }
  50% {
    left: -300px;
    opacity: 0;
  }
  50.1% {
    left: 300px;
    opacity: 0;
  }
  100% {
    left: 0px;
    opacity: 1;
  }
}
</style>
