<template>
  <el-container>
    <el-header v-if="$route.meta.hideHeader==null|!$route.meta.hideHeader">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-app"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b" router>
        <!-- <li id="logo">ERP扩展系统</li> -->
        <el-menu-item index="/home">处理中心</el-menu-item>
        <el-menu-item index="/inventory">库存查询</el-menu-item>
        <el-menu-item index="/purchase">采购单</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data () {
    return {
      activeIndex: null
    }
  },
  created () {
    const activeIndex = localStorage.getItem('activeIndex')
    if (activeIndex) {
      console.log(activeIndex)
      this.activeIndex = activeIndex
    } else {
      console.log(false)
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
      console.log(this.activeIndex)
      this.activeIndex = key
      localStorage.setItem('activeIndex', key)
    }
  }
}
</script>

<style>
#app {
}
body {
  margin: 0;
}

.el-header {
  padding: 0 !important;
}
#logo {
  float: left;
  color: white;
  font-weight: 700;
  font-size: 20px;
  padding: 15px;
}

.el-menu-app {
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  display: flex;
  float: left;
}
.el-menu-app::-webkit-scrollbar {
  display:none
}
</style>
