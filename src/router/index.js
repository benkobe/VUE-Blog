import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/Index.vue'
import Detail from '../components/Detail.vue'
import Logined from '../components/Logined.vue'
import Admin from '../components/Admin.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users.vue'
import Category from '../components/Category'
import AddCategory from '../components/AddCategory'
import Artical from '../components/Artical'
import AddArtical from '../components/AddArtical'
import Comment from '../components/Comment'
import Description from '../components/Description'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        component: Index
    },
    {
        path: '/logined',
        component: Logined,
        redirect: '/logined/description',
        children: [{
                path: '/logined/description',
                name: 'description',
                component: Description,
                meta: {
                    keepAlive: true, //此组件需要被缓存
                    isBack: false, //用于判断上一个页面是哪个
                }
            },
            {
                path: '/logined/detail',
                name: 'detail',
                component: Detail,
                meta: {
                    keepAlive: false //此组件不需要被缓存
                }
            }
        ]
    },
    {
        path: '/admin',
        component: Admin,
        redirect: '/admin/welcome',
        children: [
            { path: '/admin/welcome', component: Welcome },
            { path: '/admin/users', component: Users },
            { path: '/admin/category', component: Category },
            { path: '/admin/category/addCategory', component: AddCategory },
            { path: '/admin/artical', component: Artical },
            { path: '/admin/artical/addArtical', component: AddArtical },
            { path: '/admin/comment', component: Comment }
        ]
    }
];


const router = new VueRouter({
    routes
});

//为路由对象添加beforeEach导航守卫
//导航守卫beforeEach接收一个回调函数，回调函数有三个形参，形参to表示将要访问的页面，from表示从哪个页面跳转而来, next表示放行函数
router.beforeEach((to, from, next) => {
    //如果用户将要访问的是登录页面，直接放行
    if (to.path === '/') return next();
    //如果用户不是从登录页面来的，那么就尝试从sessionStorage中获取保存的token值
    const tokenStr = window.localStorage.getItem('token');
    //如果没有token(即token是一个空字符串)，就强制跳转到登录页面
    if (!tokenStr) return next('/');
    //如果有token就让用户继续访问用户输入的网址
    next();
});

//点击阅读原文进入文章详情页时，不保留原来的滚动距离
router.afterEach(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

export default router