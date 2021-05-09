<template>
    <div>
        <el-container>
            <el-aside width="250px" style="writing-mode:vertical-lr;font-size:80px;font-weight:1000">后台管理</el-aside>
            <el-container>
                <el-header>
                    <el-menu
                    router
                    class="el-menu-demo"
                    mode="horizontal"
                    background-color="#e9e9eb"
                    text-color="#333"
                    active-text-color="#ffd04b">
                        <el-menu-item index="/admin/users">用户</el-menu-item>
                        <el-menu-item index="/admin/category">分类</el-menu-item>
                        <el-menu-item index="/admin/artical">文章</el-menu-item>
                        <el-menu-item index="/admin/comment">评论</el-menu-item>
                        <el-button type="info" class="returnBlog" @click="returnBlog">返回博客</el-button>
                    </el-menu>
                        
                </el-header>
                <el-main>
                    <router-view :userInfo='userInfo'></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
// import eventBus from '../js/eventBus'; 
export default {
    data(){
        return{
            userInfo:{}
        }
    },
    created(){
        this.userInfo.username=window.localStorage.getItem('username');
        this.userInfo.isAdmin=window.localStorage.getItem('isAdmin');
        console.log(this.userInfo);
    },
    methods:{
        //点击返回博客按钮返回博客
        returnBlog(){
            // var username=window.localStorage.getItem('username');
            // var isAdmin=window.localStorage.getItem('isAdmin');
            this.$router.push({path:'/logined',query:this.userInfo});
        }
    }
}
</script>

<style scoped>
    .el-header {
        background-color: #e9e9eb;
        color: #333;
        text-align: center;
        line-height: 60px;
    }
    .el-aside {
        background-color: #909399;
        color: #333;
        text-align: center;
        line-height: 250px;
        letter-spacing: 20px;
        /* height: 100%; */
    }
    .el-main {
        background-color: #f4f4f5;
        color: #333;
        /* text-align: center; */
        line-height: 25px !important;
        /* height: 100%; */
    }
    body > .el-container {
        margin-bottom: 40px;
    }
    .returnBlog{
        float: right;
        margin-top: 10px;
    }
</style>