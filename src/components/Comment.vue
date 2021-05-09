<template>
    <el-card  class="box-card" style="height:620px;">
        <!-- 搜索与添加文章区域 -->
        <!-- 动态绑定gutter属性，表示row中各个col之间的间距 -->
        <el-row :gutter="20">
            <el-col :span="8">
            <!-- 搜索框中的文字与请求参数对象中的query请求参数双向绑定 -->
            <!-- 使用clearable属性即可得到一个可清空的输入框 -->
            <!-- clear类型事件会在点击由 clearable 属性生成的清空按钮时触发 -->
                <el-input
                    placeholder="请输入评论" v-model="searchData"
                >
                    <!-- 点击搜索按钮，重新向服务器端发送请求 -->
                    <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="searchComment"
                    ></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-table :data="allComments" border stripe  :header-cell-style="{textAlign: 'center'}" :cell-style="{ textAlign: 'center' }">
            <!-- 为评论列表添加索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <!-- prop属性表示文章列表中的具体某一项数据 -->
            <!-- label表示数据属于哪一列 -->
            <el-table-column prop="content" label="评论内容" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="username" label="评论用户">
            </el-table-column>
            <el-table-column prop="contentCate" label="分类">
            </el-table-column>
            <el-table-column prop="contentTitle" label="文章标题">
            </el-table-column>
            <el-table-column prop="postTime" label="评论时间">
                <template slot-scope="scope">
                    {{ scope.row.postTime | dateFormat }}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="deleteComment(scope.row)">删除</el-button>
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
            searchData:'',
            queryParams:{
                page:1
            },
            deleteQuery:{
                page:'',
                id:'',
                contentId:''
            },
            total:0,
            allComments:[],
            categoryname:''
        }
    },
    created(){
        this.getCommentList();
    },
    methods:{
        async getCommentList(){
            const {data:res} =await this.$http.get('/admin/artical/comments',{params:this.queryParams});
            // console.log(res);
            this.allComments=res.allComments;
            this.total=res.total;
            // console.log(this.allComments);
        },
        //点击页码或者跳转页码时触发
        handleCurrentChange(newPage){
            this.queryParams.page=newPage;
            this.getCommentList();
        },
        // 搜索评论
        async searchComment(){
            const {data:res}=await this.$http.get('/admin/artical/comment/search',{params:{searchQuery:this.searchData,page:this.queryParams.page}});
            // console.log(res);
            this.allComments=res.searchComment;
            this.total=res.total;
            this.code=res.code;
        },
        // 删除评论
        async deleteComment(all){
            const confirmResult=await this.$confirm(
                '确定删除该评论？',
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
            console.log(all);
            this.deleteQuery.id=all.CommentId;
            this.deleteQuery.page=this.queryParams.page;
            this.deleteQuery.contentId=all.contentId
            const {data:res} =await this.$http.get('/admin/artical/comments/delete',{params:this.deleteQuery});
            if(res.code==0){
                window.location.reload();
            }
            
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