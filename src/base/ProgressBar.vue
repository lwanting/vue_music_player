<template>
  <div class="progress-bar" @click="progressClick" ref="progressBar">
    <div class="bar-in" ref="barIn">
      <div class="progress" ref="progress"></div>
      <!-- <div class="bar-btn-wrap" > -->
      <div class="bar-btn" :class="{show: showBtn}" ref="barBtn"></div>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import { mapState } from '../store/helper/music'
export default {
  props: {
    // 控制按钮的显示方式
    showBtn: {
      type: Boolean,
      default: false
    },
    // 进度百分比
    percent: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    if (this.percent > 0) {
      this.setProgress(this.percent)
    }
  },
  methods: {
    // 根据百分比设置进度条
    setProgress(percent) {
      if (percent >= 0) {
        // 计算偏移量 (百分比 * 总长度)
        const offset = percent * this.barIn.clientWidth
        // 设置进度条实际长度
        this.progress.style.width = offset + 'px'
        // 设置按钮位置
        if (percent === 0) {
          this.barBtn.style.left = '8px'
        } else {
          this.barBtn.style.left = offset + 'px'
        }
      }
    },
    // 点击设置进度条
    progressClick(e) {
      // 获取元素相对于视口的位置
      const rect = this.progressBar.getBoundingClientRect()
      // 计算偏移量 (点击位置 - 进度条元素左边框距视口的距离)
      const offset = e.pageX - rect.left
      // 计算当前百分比
      const percent = offset / this.barIn.clientWidth
      this.$emit('percentChange', percent)
    }
  },
  computed: {
    progressBar() {
      return this.$refs.progressBar
    },
    barIn() {
      return this.$refs.barIn
    },
    progress() {
      return this.$refs.progress
    },
    barBtn() {
      return this.$refs.barBtn
    },
    ...mapState(['currentTime'])
  },
  watch: {
    // 监听百分比改变, 根据新的百分比设置进度条长度
    percent(per) {
      this.setProgress(per)
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  position: relative;
  width: 100%;
  height: 30px;
  cursor: pointer;
  .bar-in {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    transform: translateY(-50%);
    .progress {
      height: 100%;
      background-color: #d33a31;
    }
    .bar-btn {
      display: none;
      position: absolute;
      top: 50%;
      left: 0;
      width: 12px;
      height: 12px;
      background-color: #d33a31;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      &.show {
        display: block;
      }
    }
  }
  &:hover .bar-btn {
    display: block !important;
  }
}
</style>
