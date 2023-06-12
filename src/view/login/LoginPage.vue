<template>
  <div class="body">
    <div class="login-card">
      <div class="login-card-body">
        <div class="title"><h1>账号登录</h1></div>
        <login-with-account-form :login-form="loginForm" :login-rules="loginRules"
                                 :auto-login="autoLogin"/>
        <div class="commit-button">
          <el-button type="primary" @click="loginTo()" round>登录</el-button>
          <div class="to-register">还没有账号？<span @click="$message.info('注册功能还在开发中~');">去注册</span></div>
        </div>
      </div>
    </div>
    <!--    <div class="switch-button"><img src="@/assets/img/login/switch-qrcode.png" alt></div>-->
    <!--    <div v-if="activeName==='wechat'" class="switch-button-wechat">-->
    <!--      <div @click="activeName= activeName==='wechat'?'account':'wechat'" class="switch-img"></div>-->
    <!--    </div>-->
    <!--    <div v-else class="switch-button-account">-->
    <!--      <div @click="activeName= activeName==='wechat'?'account':'wechat'" class="switch-img"></div>-->
    <!--    </div>-->
  </div>
</template>

<script>
import {login} from "@/api/loginApi";
import LoginWithAccountForm from "@/view/login/form/LoginWithAccountForm";
import {Msg} from "@/tools/message";
import md5 from 'js-md5';
import {getLoginUser} from "@/api/baseApi";

export default {
  name: "Login",
  components: {LoginWithAccountForm},
  data() {
    return {
      autoLogin: 'false',
      loginForm: {
        account: '',
        password: '',
      },
      loginRules: {
        account: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, message: '密码需大于6位', trigger: 'blur'}
        ],
      },
    };
  },
  methods: {
    loginTo() {
      // this.$store.dispatch('replace', {this: this, name: 'main'});
      const loginUser = {
        uid: this.loginForm.account,
        pwd: md5(this.loginForm.password)
      }
      if (loginUser.uid === "" || loginUser.pwd === "") return;
      login(loginUser)
        .then(res => {
          if (res.status === 200) {
            localStorage.setItem('sms_token', res.data.token);
            localStorage.setItem('loginUser', JSON.stringify(res.data.loginUser));
            this.$store.state.login = true;
            this.$store.state.loginUser = res.data.loginUser;
            Msg.success(res.message);
            this.$store.dispatch('replace', {this: this, name: 'main'});
          } else {
            Msg.warning(res.message)
          }
        }).catch(err => {
        Msg.error(err.message);
      });
    },
  },
  provide() {
    return {
      loginTo: this.loginTo,
    };
  },
}
</script>

<style scoped>
div.body {
  height: calc(100vh);
  background:
    linear-gradient(
      cyan,
      transparent
    ),
    linear-gradient(
      -45deg,
      magenta,
      transparent
    ),
    linear-gradient(
      45deg,
      yellow,
      transparent
    );
  background-blend-mode: multiply;
}
.login-card {
  border-radius: 50px;
  display: block;
  max-width: 470px;
  max-height: 450px;
  background: #fff;
  border: 1px solid #eee;
  box-shadow: 0 0 61px 0 rgb(85 108 144 / 7%);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

.login-card-body {
  padding: 0 60px;
  width: 350px;
}

.login-card .title {
  padding: 18px;
}

.login-card .title h2 {
  font-size: 26px;
  font-weight: 600;
}

.login-card p {
  font-size: 18px;
  font-weight: 700;
  text-align: start;
}

.title {
  text-align: center;
  margin: 12px 0;
}

.commit-button {
  margin-top: 15px;
  padding-bottom: 13px;
}

.to-register {
  margin-top: 25px;
  font-size: 15px;
  text-align: right;
}

.to-register span {
  color: #4285f4;
  cursor: pointer;
}

.switch-button-account, .switch-button-wechat {
  height: 70px;
  width: 100%;
  text-align: start;
}

.switch-img {
  height: 70px;
  width: 70px;
  cursor: pointer;
  transform: rotateY(180deg);
  background-size: 70px;
}

.switch-button-wechat .switch-img {
  background-position: 0 -140px;
}

.el-tabs {
  margin-bottom: 14px;
}

/deep/ .el-tabs__nav-wrap::after {
  position: static !important;
}

/deep/ .el-tabs__active-bar {
  transition: 0s;
  margin-left: 15px;
  width: 76px !important;
}

/deep/ .el-tabs__nav {
  transition: 0s;
}

/deep/ .el-tabs__item {
  padding-bottom: 9px;
  width: 76px;
  font-size: 19px;
  line-height: 35px;
  color: #74787c
}

.el-button {
  width: 100%;
  height: 52px;
  background-color: #4285f4;
  font-size: 15px;
}
</style>
