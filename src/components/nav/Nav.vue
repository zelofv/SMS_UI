<template>
  <div id="nav">
    <el-container>
      <el-header style="background-color: #6cc1ff">
        <top-nav/>
      </el-header>
      <el-container>
        <el-aside width="201px">
          <left-nav/>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              v-for="route in $route.matched"
              :key="route.path"
              :to="{path: route.path === '' ? '/' : route.path}">
              {{ route.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TopNav from "@/components/nav/TopNav";
import LeftNav from "@/components/nav/LeftNav";

export default {
  name: "Nav",
  components: {LeftNav, TopNav}
}
</script>

<style scoped>
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}


.is-vertical {
  height: 100%;
}

#nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.el-breadcrumb {
  margin-bottom: 20px;
}
</style>
