<template>
  <el-form :model="loginForm" :rules="loginRules" ref="ruleForm">
    <el-form-item prop="account">
      <el-input prefix-icon="el-icon-user"
                v-model="loginForm.account"
                type="text" placeholder="请输入账号"
                autocomplete="on"
                clearable></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input prefix-icon="el-icon-lock"
                v-model="loginForm.password"
                type="password" placeholder="请输入密码"
                autocomplete="on"
                show-password clearable @keyup.enter.native="login"></el-input>
    </el-form-item>

    <el-form-item>
      <el-checkbox class="auto-login-button" v-model="autoLogin">下次自动登录</el-checkbox>
      <span class="forget" @click="$message.info('忘记密码功能还在开发中~');">忘记密码？</span></el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "LoginWithAccountForm",
  props: ['loginForm', 'loginRules', 'autoLogin'],
  inject: ["loginTo"],
  methods: {
    login() {
      return this.loginTo();
    }
  }
}
</script>

<style scoped>
.forget {
  position: absolute;
  right: 0;
  font-size: 16px;
  color: rgb(116, 120, 124);
  user-select: none;
  cursor: pointer;
}

.auto-login-button {
  position: absolute;
  left: 0;
}

/deep/ .el-form-item {
  margin-bottom: 20px;
}

/deep/ .el-input__inner {
  height: 48px;
  font-size: 16px;
  padding-left: 40px;
}

/deep/ .el-checkbox__label {
  font-size: 16px;
}

/deep/ .el-form-item__content {
  width: 100%;
  height: 48px;
  /*display: flex;*/
  /*justify-content: space-around;*/
}

/deep/ .el-input__prefix .el-input__icon {
  font-size: 30px;
  margin-top: 7px;
  margin-left: 4px;
}
/deep/ .el-input__suffix-inner .el-input__icon {
  font-size: 20px;
}
</style>
