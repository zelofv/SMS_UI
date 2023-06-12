import Vue from "vue";
import Vuex from 'vuex';
import {getUser} from "@/api/userApi";
import {Msg} from "@/tools/message";
import {getMenu} from "@/api/baseApi";

Vue.use(Vuex)

const actions = {
  getUserInfo(context) {
    let user = sessionStorage.getItem('user');
    if (user) {
      state.userInfo = JSON.parse(user)
      return;
    }
    getUser()
      .then(res => {
        context.commit('getUserInfo', res.data);
      }).catch(err => Msg.error(err));
  },
  getMenu(context) {
    getMenu(state.loginUser.id)
      .then(res => {
        context.commit('getTreeNode', res.data);
      }).catch(err => Msg.error(err));
  },

  push(context, page) {
    if (page.this.$route.name === page.name) return;
    context.commit('push', page);
  },
  replace(context, page) {
    if (page.this.$route.name === page.name) return;
    context.commit('replace', page);
  },
}

const mutations = {
  getUserInfo(state, data) {
    sessionStorage.setItem('user', JSON.stringify(data))
    state.userInfo = data;
  },
  getMenu(state, data) {
    state.menu = data;
  },
  push(state, page) {
    page.this.$router.push({
      name: page.name,
    }).catch(err => Msg.error(err));
  },
  replace(state, page) {
    page.this.$router.replace({
      name: page.name,
    }).catch(err => Msg.error(err));
  }
}

const state = {
  loginUser: {},
  login: false,
  menu: {},
  collegeReverseMap: {
    '计算机科学与工程学院':'03',
    '管理学院':'08',
    '药学与生物工程学院':'10',
    '两江人工智能学院':'23',
  },
  collegeMap: {
    '03': '计算机科学与工程学院',
    '08': '管理学院',
    '10': '药学与生物工程学院',
    '23': '两江人工智能学院',
  },
  majorReverseMap: {
   "计算机" : "0302",
   "管理" : "0802",
   "药学与生物医学" : "1002",
   "大数据" : "2301",
   "软件工程" : "2302",
   "智科" : "2304",
   "人工智能" : "2305",
  },
  majorMap: {
    "0302": "计算机",
    "0802": "管理",
    "1002": "药学与生物医学",
    "2301": "大数据",
    "2302": "软件工程",
    "2304": "智科",
    "2305": "人工智能",
  }
  // userInfo: {
  //   avatar: '',
  //   deleted: false,
  //   email: '',
  //   identity: '',
  //   name: '',
  //   password: '',
  //   phone: '',
  //   school: '',
  //   sid: '',
  //   time: '',
  //   uid: ''
  // },
  // thisCourseInfo: {
  //   courseid: '',
  //   name: '',
  //   admin: '',
  //   adminid: '',
  //   classes: '',
  //   semester: '',
  //   mode: '',
  //   description: '',
  //   place: '',
  //   code: '',
  //   period: '',
  //   img: '',
  //   students: '',
  //   connect: '',
  // },
  // classInfo: {},
}

const getters = {}

export default new Vuex.Store({
  actions, mutations, state, getters
})
