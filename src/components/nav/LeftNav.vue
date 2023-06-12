<template>
  <div class="left">
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#545c64"
      :active="$route.path"
      text-color="#fff"
      active-text-color="#ffd04b" router>
      <el-menu-item index="/main">首页</el-menu-item>
      <el-submenu :index="menu.order" v-for="menu in menus" :key="menu.id">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{ menu.name }}</span>
        </template>
        <el-menu-item :index="`${menu.path}${item.path}`"
                      v-for="item in menu.children"
                      :key="item.id">{{ item.name }}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
import {getTreeNode} from "@/api/baseApi";
import {Msg} from "@/tools/message";
import store from "@/store";

export default {
  name: 'leftNav',
  data() {
    return {
      // menus: this.$store.state.menu,
      // role: this.$store.state.loginUser.role;
      menus: [
        {
          id: 1,
          name: '学生管理',
          children: [
            {
              id: 4,
              name: '学生信息管理',
              children: [],
              order: null,
              path: "/studentInfo"
            }
          ],
          order: '1',
          path: "/student"
        },
        {
          id: 2,
          name: '教师管理',
          children: [
            {
              id: 5,
              name: '教师信息管理',
              children: [],
              order: null,
              path: "/teacherInfo"
            }
          ],
          order: '2',
          path: "/teacher"
        },
        {
          id: 3,
          name: '班级管理',
          children: [
            {
              id: 6,
              name: '班级信息管理',
              children: [],
              order: null,
              path: "/classesInfo"
            }
          ],
          order: '3',
          path: "/classes"
        },
      ],
    }
  },
  methods: {},
  mounted() {
    // this.$store.dispatch("getTreeNode");
    // console.log(JSON.stringify(this.menus));
    getTreeNode({role: JSON.parse(localStorage.getItem("loginUser")).role}).then(res => {
      if (res.status === 200) {
        this.menus = JSON.parse(res.data);
      } else {
        Msg.warning(res.message);
      }
    }).catch(err => Msg.error(err));
  }
}
</script>

<style scoped>
.left {
  height: 100%;
  background-color: #545c64;
}
</style>
