import Vue from 'vue'
import Router from 'vue-router'
import Nav from "@/components/nav/Nav";

Vue.use(Router)

const routes = [
  {
    path: '/login',
    name: 'login',
    // meta: {
    //   label: '登录',
    //   title: 1,
    //   icon: 'icon iconfont icon-fl-origin',
    //   requireAuth: false
    // },
    component: () => import('@/view/login/LoginPage')
  },
  {
    path: '/',
    name: 'index',
    redirect: '/login',
  },
  {
    path: '/main',
    name: 'main',
    meta: {
      title: "首页"
    },
    component: Nav,
    children: [
      {
        path: '/main',
        name: 'main',
        component: () => import('@/view/main/Main'),
      },
      {
        path: '/student/studentInfo',
        name: 'studentInfo',
        meta: {
          title: "学生信息管理"
        },
        component: () => import('@/view/student/studentInfo'),
      },
      {
        path: '/teacher/teacherInfo',
        name: 'teacherInfo',
        meta: {
          title: "教师信息管理"
        },
        component: () => import('@/view/teacher/teacherInfo'),
      },
      {
        path: '/classes/classesInfo',
        name: 'classesInfo',
        meta: {
          title: "班级信息管理"
        },
        component: () => import('@/view/classes/classesInfo'),
      }
    ]

  },
  {
    path: '/404',
    name: '404',
  },
];

const router = new Router({routes});

// router.beforeEach(async (to, from, next) => {
//   NProgress.start()
//   /**
//    * 根据当前系统修改浏览器title
//    */
//   if (to.meta.title) {
//     let systemResource = Vue.prototype.SystemResource;
//     document.title = systemResource.title;
//     let head = document.getElementsByTagName('head')[0];
//     let ico;
//     //创建一个link标签
//     let linkTag = document.createElement('link');
//     //配置link的相关属性
//     linkTag.setAttribute("rel", "Shortcut Icon");
//     linkTag.setAttribute("type", "image/x-icon");
//     ico = '../../static/favicon.ico';
//
//     linkTag.href = ico;
//     head.appendChild(linkTag);
//   }
//   /** 判断用户是否已经登录 */
//   if (store.getters.isLogin) {
//     /** 已经登录情况下访问 /login, 则直接进入 /index */
//     if (to.path === '/login') {
//       next()
//       NProgress.done()
//     } else {
//       // 页面刷新时，重新赋值
//       let operatorType = window.sessionStorage.getItem('operatorType')
//       if (operatorType && operatorType !== '[object Object]') {
//         store.commit('setOperatorType', JSON.parse(operatorType))
//       }
//       next()
//     }
//   } else {
//     if (noPermission(to.path) || (to.meta.requireAuth == false)) {
//       next()
//     } else {
//       next('/login')
//       NProgress.done()
//     }
//   }
// })
//
// function noPermission(path) {
//   return ['/404',].indexOf(path) > -1
// }

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router;
