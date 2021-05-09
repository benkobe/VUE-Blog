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
                placeholder="请输入文章题目" v-model="searchData"
            >
                <!-- 点击搜索按钮，重新向服务器端发送请求 -->
                <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchArtical"
                ></el-button>
            </el-input>
            </el-col>
            <el-col :span="4">
            <el-button type="primary" class="addArtical" @click="goAddArtical">
                <!-- <a href="http://localhost:8081/#/admin/artical/addArtical"> -->
                添加文章
                <!-- </a> -->
            </el-button
            >
            </el-col>
        </el-row>
        <el-table :data="contents" border stripe  :header-cell-style="{textAlign: 'center'}" :cell-style="{ textAlign: 'center' }">
            <!-- 为文章列表添加索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <!-- prop属性表示文章列表中的具体某一项数据 -->
            <!-- label表示数据属于哪一列 -->
            <el-table-column prop="title" label="标题">
            </el-table-column>
            <el-table-column prop="description" label="简介" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="categoryname.categoryname" label="所属分类">
            </el-table-column>
            <el-table-column prop="addTime" label="发表时间">
                <template slot-scope="scope">
                    {{ scope.row.addTime | dateFormat }}
                </template>
            </el-table-column>
            <el-table-column prop="user.username" label="作者">
            </el-table-column>
            <el-table-column prop="views" label="阅读量">
            </el-table-column>
            <el-table-column label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="scope">
                    <el-button type="info" size="mini" @click="showEditContentDialog(scope.row._id)">修改</el-button>
                    <el-button type="danger" size="mini" @click="deleteContent(scope.row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page.sync="queryParams.page"
            layout="total,prev, pager, next, jumper"
            :total="total"
            :page-size="8">
        </el-pagination>
        <!-- 修改文章的对话框 -->
        <el-dialog
            title="修改文章"
            :visible.sync="dialogVisible"
            width="80%">
                <el-form :model="editContentInfo" :rules="editContentRules" ref="editContentRef" label-width="100px">
                    <el-form-item label="分类名称：" prop="categoryname">
                        <el-select placeholder="请选择分类" v-model="articalCategory" @change="selectesCategory">
                            <!-- value为select绑定的值,label 为select选中框内显示的值 -->
                            <el-option :value="item._id" :label="item.categoryname" v-for="item in allCategory" :key="item._id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="title" label='文章标题：'>
                        <el-input
                            type='text'
                            placeholder="请输入文章题目"
                            v-model="editContentInfo.title"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="description" label='文章简介：'>
                        <el-input
                            type='text'
                            placeholder="请输入文章简介"
                            v-model="editContentInfo.description"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="content" label='文章正文：'>
                        <quill-editor v-model="editContentInfo.content">
                        </quill-editor>
                    </el-form-item>
                </el-form>
                <div class="tips">文章已存在</div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancleEdit">取 消</el-button>
                    <el-button type="primary" @click="saveEditContent">确 定</el-button>
                </span>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    data(){
        return{
            searchData:'',
            contents:[],
            newArticalInfo:[],
            addArticalRules:[],
            queryParams:{
                page:1  
            },
            //数据的总条数
            total:0,
            dialogVisible:false,
            // 用于展示分类选择的所有分类
            allCategory:[],
            //根据点击修改按钮的所属分类的id查询出来的分类信息
            editContentInfo:{},
            //修改分类的表单的验证规则
            editContentRules:{
                categoryname:[
                    {
                        required:true,
                        message:'请选择文章分类',
                        trigger:'blur'
                    }
                ],
                title:[
                    {
                        required:true,
                        message:'请输入文章标题',
                        trigger:'blur'
                    },
                    {
                        min:1,
                        max:50,
                        trigger:'blur'
                    }
                ],
                description:[
                    {
                        required:true,
                        message:'请输入文章简介',
                        trigger:'blur'
                    },
                    {
                        min:1,
                        max:200,
                        trigger:'blur'
                    }
                ],
                content:[
                    {
                        required:true,
                        message:'请输入文章正文',
                        trigger:'blur'
                    },
                    {
                        min:1,
                        trigger:'blur'
                    }
                ]
            },
            // 被选中的分类(值为分类的id)
            articalCategory:''
        }
    },
    created(){
        this.getArticalList();
        this.getCategoryList();
    },
    methods:{
        async getCategoryList(){
           const {data:res}  =await this.$http.get('/admin/allCategory');
           this.allCategory=res.allCategory;
        },
        async getArticalList(){
            const {data:res} =await this.$http.get('/admin/artical',{params:this.queryParams});
            this.contents=res.contents;
            this.total=res.total;
        },
        //点击页码或者跳转页码时触发
        handleCurrentChange(newPage){
            this.queryParams.page=newPage;
            this.getArticalList();
        },
        // 搜索文章
        async searchArtical(){
            const {data:res}=await this.$http.get('/admin/artical/search',{params:{searchQuery:this.searchData,page:this.queryParams.page}});
            this.contents=res.contents;
            this.total=res.total;
            this.code=res.code;
        },
        goAddArtical(){
            this.$router.push('/admin/artical/addArtical');
        },
        //点击修改按钮显示修改分类的对话框
        async showEditContentDialog(id){
            const {data:res}=await this.$http.get('/admin/artical/edit',{params:{id:id}});
            this.editContentInfo=res.editContentInfo;
            this.articalCategory=res.editContentInfo.categoryname;
            this.dialogVisible=true;
            document.querySelector('.tips').style.display='none';
        },
        //点击修改分类对话框中的取消按钮
        cancleEdit(){
            this.$refs.editContentRef.clearValidate();
            this.dialogVisible=false;
        },
        //点击修改分类对话框中的确定按钮，保存修改分类的信息
        saveEditContent(){
            this.$refs.editContentRef.validate(async valid=>{
                if(!valid) return;
                console.log(this.editContentInfo);
                const {data:res}=await this.$http.post('/admin/artical/saveEdit',this.editContentInfo);
                // console.log(res);
                //后端返回code为0表示已经保存了修改的分类
                if(res.code===0){
                    this.getArticalList();
                }
                //后端返回code为2表示新输入的分类已经存在
                else if(res.code===2){
                    document.querySelector('.tips').style.display='block';
                    //如果新输入的分类名称已经存在，继续显示对话框
                    return;
                }
                //隐藏对话框
                this.dialogVisible=false;
            });
        },
        selectesCategory(){
            this.newArticalInfo.categoryname=this.articalCategory;
            this.editContentInfo.categoryname=this.articalCategory;
        },
        // 删除文章
        async deleteContent(id){
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
            await this.$http.get('/admin/artical/delete',{params:{id:id}});
            this.getArticalList();
        }
    }
}
</script>

<style scoped>
    .addArtical a{
        list-style: none;
        color: #fff;
        text-decoration: none;
    }
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
    .tips{
        display: none;
        width: 100px;
        height: 25px;
        background-color: pink;
        text-align: center;
        line-height: 25px;
        color: #000;
        border-radius: 5px;
        margin-left: 100px;
        margin-top: -10px;
    }
</style>