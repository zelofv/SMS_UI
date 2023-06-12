<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24" class="top-bar-wrap">
      <div class="top-bar-logo top-bar-btn">
        <h1>学校信息管理系统</h1>
        <!--        <a href="/"><img src="@/assets/logo.png" style="padding-left:8px;" alt=""></a>-->
      </div>

      <div class="top-bar-account top-bar-btn">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link userinfo-inner">
            <span>{{ loginUser.name }}</span>
            <i class="el-icon-caret-bottom"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div><span style="color: #555;font-size: 14px;">个人信息</span></div>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
  </el-row>
</template>

<script>

export default {
  name: "TopNav",
  data() {
    return {
      loginUser: this.$store.state.loginUser,
      // loginUser: {name: this.$store.state.loginUser.name},
    }
  },
  methods: {
    logout() {
      this.$store.state.loginUser = {};
      this.$store.state.login = false;
      localStorage.removeItem('sms_token');
      localStorage.removeItem('loginUser');
      // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
      setTimeout(() => {
        this.$router.replace({
          path: '/login'
        });
      }, 500);
    }
  },
  mounted() {
    this.loginUser = JSON.parse(localStorage.getItem("loginUser"));
    this.$store.state.loginUser = localStorage.getItem("loginUser");
  }
}
</script>

<style scoped>
.userinfo-inner {
  font-size: 18px;
  color: white;
}

h1 {
  color: #fff;
  font-size: 36px;
  position: absolute;
  left: 0;
}

.top-bar-account .el-dropdown {
  position: absolute;
  right: 10px;
}
</style>
