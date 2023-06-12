<template>
  <div>
    <!--    <el-page-header content="学校信息管理系统"></el-page-header>-->
    <h1>欢迎使用学校信息管理系统</h1>
  </div>
</template>

<script>
import {getLoginUser} from "@/api/baseApi";
import {Msg} from "@/tools/message";

export default {
  name: "Main",

  data() {
    return {}
  },

}
</script>

<style scoped>
h1 {
  font-size: 50px;
}
</style>
