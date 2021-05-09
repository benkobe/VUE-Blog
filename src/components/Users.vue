<template>
    <el-card class="box-card" style="height:620px;">
        <!-- 搜索与添加文章区域 -->
        <!-- 动态绑定gutter属性，表示row中各个col之间的间距 -->
        <el-row :gutter="20">
            <el-col :span="8">
            <!-- 搜索框中的文字与请求参数对象中的query请求参数双向绑定 -->
            <!-- 使用clearable属性即可得到一个可清空的输入框 -->
            <!-- clear类型事件会在点击由 clearable 属性生成的清空按钮时触发 -->
                <el-input placeholder="请输入用户名" v-model="searchData">
                    <!-- 点击搜索按钮，重新向服务器端发送请求 -->
                    <el-button
                        slot="append"
                        icon="el-icon-search"
                        @click="searchUser"
                    ></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-table :data="userList" border stripe  :header-cell-style="{textAlign: 'center'}" :cell-style="{ textAlign: 'center' }">
            <!-- 为用户列表添加索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <!-- prop属性表示用户数据列表中的具体某一项数据 -->
            <!-- label表示数据属于哪一列 -->
            <el-table-column prop="username" label="用户名" width="180" >
            </el-table-column>
            <el-table-column prop="isAdmin" label="管理员" width="180" >
                <template slot-scope="scope">
                    <span v-if="scope.row.isAdmin">是</span>
                    <span v-else>否</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="deleteUser(scope.row._id)">注销用户</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page.sync="queryParams.page"
            layout="total,prev, pager, next, jumper"
            :page-size="8"
            :total="total">
        </el-pagination>
    </el-card>
</template>

<script>
export default {
    data(){
        return{
            userList:[],
            queryParams:{
                page:1  
            },
            //数据的总条数
            total:0,
            searchData:'',
            code:10
        }
    },
    created(){
        //渲染User组件时立即调用请求注册用户列表的方法
        this.getUserList();
    },
    methods:{
        //请求注册用户的列表
        async getUserList(){
            // const result=await this.$http.get('/admin/users',{params:this.queryParams});
            // console.log(result);
            const {data:res}=await this.$http.get('/admin/users',{params:this.queryParams});
            this.userList=res.userList;
            // console.log(res);
            this.total=res.total;
        },
        //点击页码或者跳转页码时触发
        handleCurrentChange(newPage){
            if(this.code==100){
                this.queryParams.page=newPage;
                this.searchUser();
            }else{
                this.queryParams.page=newPage;
                this.getUserList();
            }
        },
        // 搜索用户
        async searchUser(){
            const {data:res}=await this.$http.get('/admin/user/search',{params:{searchQuery:this.searchData,page:this.queryParams.page}});
            // console.log(res);
            this.userList=res.allUsers;
            this.total=res.total;
            this.code=res.code;
        },
        //点击注销用户按钮删除用户
        async deleteUser(id){
            const confirmResult=await this.$confirm(
                '确定删除该用户？',
                '提示',
                {
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning',
                }
            ).catch(err=>err)
            if(confirmResult!=='confirm'){
                return
            }
            this.$http.get('/admin/user/delete',{params:{id:id}});
            this.getUserList();
        }
    }
    
}
</script>
    
<style scoped>
    .el-card{
        position: relative;
    }
    .el-table{
        margin-top: 20px;
    }
    .el-pagination{
        /* margin-top: 25px; */
        position: absolute;
        bottom: 20px;
    }
    /* 修改分页按钮的颜色 */
    ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color:#909399;
        color: #fff;
    }
</style>