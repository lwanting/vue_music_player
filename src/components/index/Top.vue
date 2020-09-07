<template>
  <div class="header">
    <div class="left">
      <!-- 首页，放缩按钮 -->
      <div class="button">
        <span class="left-button" @click="toHome()"></span>
        <span class="middle-button" @click="exitFullScreen()"></span>
        <span class="right-button" @click="fullScreen()"></span>
      </div>
      <!-- 前进后退键 -->
      <div class="history">
        <span class="back" @click="back()"></span>
        <span class="go" @click="forward()"></span>
      </div>
    </div>
    <div class="right">
      <search-input />
    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import SearchInput from '../search-wrap/SearchInput'
export default {
  data() {
    return {
      // query: ''
    }
  },
  components: {
    SearchInput
  },
  methods: {
    // 返回首页
    toHome() {
      this.$router.push('/')
    },
    // 全屏
    fullScreen() {
      screenfull.request()
    },
    // 退出全屏
    exitFullScreen() {
      screenfull.exit()
    },
    // 后退
    back() {
      this.$router.go(-1)
    },
    // 前进
    forward() {
      this.$router.go(1)
    }
  }
  // watch: {
  //   query() {
  //     this.$store.commit('saveKeywords', this.query)
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 54px;
  background-color: #c62f2f;
  .left {
    position: relative;
    left: 0;
    width: 200px;
    height: 100%;
    margin-left: 5px;

    .button {
      display: flex;
      justify-content: space-between;
      position: absolute;
      left: 0;
      width: 70px;
      height: 30px;
      margin-top: 10px;

      span[class$='button'] {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        text-align: center;
        line-height: 16px;
        cursor: pointer;
        &:hover::before {
          font-family: 'iconfont' !important;
          font-size: 12px;
          color: #383737;
          opacity: 1;
        }
      }
      .left-button {
        background-color: #dd6d60;
        &::before {
          content: '\e605';
          opacity: 0;
        }
      }
      .middle-button {
        background-color: #dcc060;
        &::before {
          content: '\e621';
          opacity: 0;
        }
      }
      .right-button {
        background-color: #84bb58;
        &::before {
          content: '\e776';
          opacity: 0;
        }
      }
    }
    .history {
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: absolute;
      left: 120px;
      width: 80px;
      height: 100%;

      span {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        &:hover {
          background-color: rgb(0, 0, 0, 0.2);
        }
      }
      .back::after {
        content: '\e602';
        font-family: 'iconfont' !important;
        font-size: 16px;
        color: rgb(250, 250, 250, 0.8);
      }
      .go::after {
        content: '\e600';
        font-family: 'iconfont' !important;
        font-size: 16px;
        color: rgb(250, 250, 250, 0.8);
      }
    }
  }
  .right {
    margin-right: 100px;
  }
}
</style>
