<template>
  <div class="mvs">
    <!-- mv分类tab栏 -->
    <div class="tab-wrap" ref="tab">
      <!-- 地区tab -->
      <div class="area-tab">
        <span class="tab-type">地区：</span>
        <ul class="area">
          <li
            class="item"
            :class="{active: area==item}"
            v-for="(item, index) in areaTab"
            :key="index"
            @click="toggle(item, tag=0)"
          >{{item}}</li>
        </ul>
      </div>
      <!-- 类型tab -->
      <div class="type-tab">
        <span class="tab-type">类型：</span>
        <ul class="type">
          <li
            class="item"
            :class="{active: type==item}"
            v-for="(item, index) in typeTab"
            :key="index"
            @click="toggle(item, tag=1)"
          >{{item}}</li>
        </ul>
      </div>
      <!-- 排序tab -->
      <div class="order-tab">
        <span class="tab-type">排序：</span>
        <ul class="order">
          <li
            class="item"
            :class="{active: order==item}"
            v-for="(item, index) in orderTab"
            :key="index"
            @click="toggle(item, tag=2)"
          >{{item}}</li>
        </ul>
      </div>
    </div>
    <!-- mv区域 -->
    <div class="mvList">
      <!-- mv列表 -->
      <div class="list">
        <div class="item" v-for="(item, index) in mvs" :key="index" @click="toMv(item.id)">
          <div class="cover">
            <img :src="item.cover" alt />
            <div class="play-box">
              <span class="iconfont icon-play"></span>
            </div>
            <div class="num-box">
              <span class="iconfont icon-play"></span>
              <span class="num">{{item.playCount | formatCount}}</span>
            </div>
          </div>
          <div class="detail">
            <p class="name">{{item.name}}</p>
            <p class="singer">{{item.artistName}}</p>
          </div>
        </div>
      </div>
      <!-- 分页区域 -->
      <div class="pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :page-size="40"
          :current-page="page"
          @current-change="pageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getMvs } from '../../api/mvs'
export default {
  data() {
    return {
      // 地区选项
      areaTab: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
      // 类型选项
      typeTab: ['全部', '官方版', '原生', '现场版', '网易出品'],
      // 排序选项
      orderTab: ['上升最快', '最热', '最新'],
      // 地区默认为全部
      area: '全部',
      // 类型默认为全部
      type: '全部',
      // 排序默认为上升最快
      order: '上升最快',
      // 全部mv列表
      mvs: [],
      // 当前页码
      page: 1,
      // 总数
      total: 0,
      // 偏移量
      offset: 0
    }
  },
  created() {
    // 获取mv
    this.setMvs()
  },
  methods: {
    // tab切换
    toggle(item, tag) {
      switch (tag) {
        case 0:
          this.area = item
          break
        case 1:
          this.type = item
          break
        case 2:
          this.order = item
          break
      }
      // 重新获取mv
      this.setMvs()
    },
    // 根据参数获取mv
    async setMvs() {
      const { data: res } = await getMvs({
        area: this.area,
        type: this.type,
        order: this.order,
        offset: this.offset,
        limit: 40
      })
      this.mvs = res.data
      if (res.count) {
        this.total = res.count
      }
      // console.log(res)
    },
    // 页面改变, 计算偏移量
    pageChange(page) {
      this.page = page
      this.offset = (page - 1) * 40
      // 根据偏移量重新获取歌单
      this.setMvs()
      // 返回顶部
      this.$refs.tab.scrollIntoView({ behavior: 'smooth' })
    },
    // 跳转到Mv详情页面
    toMv(id) {
      this.$router.push(`/mv?id=${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.mvs {
  margin: 20px 120px 0 120px;
  // mv分类tab栏
  .tab-wrap {
    div[class$='-tab'] {
      display: flex;
      margin-bottom: 15px;
      align-items: center;
      height: 30px;
      .tab-type {
        font-size: 14px;
        color: #444444;
      }
      ul {
        margin-left: 10px;
        .item {
          margin: 5px 10px;
          float: left;
          padding: 4px 15px;
          border-radius: 20px;
          font-size: 14px;
          color: gray;
          cursor: pointer;
        }
        .active {
          background-color: rgb(240, 222, 219, 0.4);
          color: #d74d45;
        }
      }
    }
  }
  // mv区域
  .mvList {
    // mv列表
    .list {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 30px;
      .item {
        width: 25%;
        padding: 10px;
        cursor: pointer;
        .cover {
          position: relative;
          &:hover .play-box {
            opacity: 1;
          }
          img {
            width: 100%;
            height: 100%;
            border-radius: 6px;
            overflow: hidden;
          }
          .play-box {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 50px;
            height: 50px;
            background-color: rgb(255, 255, 255, 0.7);
            border-radius: 50%;
            text-align: center;
            line-height: 50px;
            opacity: 0;
            transform: translate(-50%, -50%);
            transition: all 0.5s;
            .icon-play {
              color: #d33a31;
              font-size: 25px;
            }
          }
          .num-box {
            position: absolute;
            top: 2px;
            right: 5px;
            color: #fff;
            font-size: 13px;
            .icon-play {
              font-size: 13px;
              margin-right: 5px;
            }
          }
        }
        .detail {
          font-size: 13px;
          .name {
            color: #333;
            margin-bottom: 0;
          }
          .singer {
            color: #bebebe;
            margin-top: 3px;
          }
        }
      }
    }
    // 分页区域
    .pagination {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      ::v-deep.el-pager li.active {
        color: #d33a31;
      }
      ::v-deep.el-pager li:hover {
        color: #d33a31;
      }
      ::v-deep.el-icon:hover {
        color: #d33a31;
      }
    }
  }
}
</style>
