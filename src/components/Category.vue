<template>
    <el-card class="box-card" style="height:620px;">
        <!-- 搜索与添加分类区域 -->
        <!-- 动态绑定gutter属性，表示row中各个col之间的间距 -->
        <el-row :gutter="20">
            <el-col :span="8">
            <!-- 搜索框中的文字与请求参数对象中的query请求参数双向绑定 -->
            <!-- 使用clearable属性即可得到一个可清空的输入框 -->
            <!-- clear类型事件会在点击由 clearable 属性生成的清空按钮时触发 -->
            <el-input placeholder="请输入分类名称" v-model="searchData">
                <!-- 点击搜索按钮，重新向服务器端发送请求 -->
                <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchCategory"
                ></el-button>
            </el-input>
            </el-col>
            <el-col :span="4">
            <el-button type="primary" class="addCategory" @click="goAddCategory">
                <!-- <a href="http://localhost:8081/#/admin/category/addCategory"> -->
                添加分类
                <!-- </a> -->
            </el-button>
            </el-col>
        </el-row>
        <el-table :data="categoryList" border stripe  :header-cell-style="{textAlign: 'center'}" :cell-style="{ textAlign: 'center' }">
            <!-- 为分类列表添加索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <!-- prop属性表示分类列表中的具体某一项数据 -->
            <!-- label表示数据属于哪一列 -->
            <el-table-column prop="_id" label="id" width="250" >
            </el-table-column>
            <el-table-column prop="categoryname" label="分类名称" width="180" >
            </el-table-column>
            <el-table-column label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="scope">
                    <el-button type="info" size="mini" @click="showEditCateDialog(scope.row._id)">修改</el-button>
                    <el-button type="danger" size="mini" @click="deleteCategory(scope.row._id)">删除</el-button>
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
        <!-- 修改分类的对话框 -->
        <el-dialog
            title="修改分类"
            :visible.sync="dialogVisible"
            width="40%">
                <el-form :model="editCategoryInfo" :rules="editCategoryRules" ref="editCategoryRef" label-width="100px">
                    <el-form-item prop="categoryname" label='分类名称：'>
                        <el-input
                            type='text'
                            v-model="editCategoryInfo.categoryname"
                            clearable>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div class="tips">分类已存在</div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancleEdit">取 消</el-button>
                    <el-button type="primary" @click="saveEditCategory">确 定</el-button>
                </span>
        </el-dialog>
        <el-dialog
            title="删除分类失败"
            :visible.sync="failDialog"
            width="20%">
                <div class="warn">该分类下还有文章，暂不可删除<br>想要删除该分类，先把文章删除</div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="sureBtn">确 定</el-button>
                </span>
        </el-dialog>
    </el-card>
</template>
    
<script>
export default {
    data(){
        return{
            searchData:'',
            //所有的分类信息
            categoryList:[],
            queryParams:{
                page:1
            },
            total:0,
            //对话框的显示与隐藏
            dialogVisible: false,
            failDialog:false,
            //根据点击修改按钮的所属分类的id查询出来的分类信息
            editCategoryInfo:{},
            //修改分类的表单的验证规则
            editCategoryRules:{
                categoryname:[
                    {
                    required:true,
                    message:'请输入分类名称',
                    trigger:'blur'
                    },
                    {
                    min:1,
                    max:12,
                    trigger:'blur'
                    }
                ]
            }
        }
    },
    created(){
        this.getCategoryList();
    },
    methods:{
        async getCategoryList(){
           const {data:res}  =await this.$http.get('/admin/category',{params:this.queryParams});
           this.categoryList=res.categoryList;
           this.total=res.total;
        },
        //点击页码或者跳转页码时触发
        handleCurrentChange(newPage){
            this.queryParams.page=newPage;
            this.getCategoryList();
        },
        //点击修改按钮显示修改分类的对话框
        async showEditCateDialog(id){
            const {data:res}=await this.$http.get('/admin/category/edit',{params:{id:id}});
            this.editCategoryInfo=res.editCategoryInfo;
            this.dialogVisible=true;
            document.querySelector('.tips').style.display='none';
        },
        //点击修改分类对话框中的取消按钮
        cancleEdit(){
            this.$refs.editCategoryRef.clearValidate();
            this.dialogVisible=false;
        },
        //点击修改分类对话框中的确定按钮，保存修改分类的信息
        saveEditCategory(){
            this.$refs.editCategoryRef.validate(async valid=>{
                if(!valid) return;
                const {data:res}=await this.$http.post('/admin/category/edit',this.editCategoryInfo);
                // console.log(res);
                //后端返回code为0表示已经保存了修改的分类
                if(res.code===0){
                    this.getCategoryList();
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
        // 搜索分类
        async searchCategory(){
            const {data:res}=await this.$http.get('/admin/category/search',{params:{searchQuery:this.searchData,page:this.queryParams.page}});
            // console.log(res);
            this.categoryList=res.allCategory;
            this.total=res.total;
            this.code=res.code;
        },
        //删除分类
        async deleteCategory(id){
            const confirmResult=await this.$confirm(
                '确定删除该分类？',
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
            const {data:res}=await this.$http.get('/admin/category/delete',{params:{id:id}});
            if(res.code==0){
                this.failDialog=true;
            }else{
                console.log(res.code);
                this.getCategoryList();
            }
        },
        sureBtn(){
            this.failDialog=false;
        },
        goAddCategory(){
            this.$router.push('/admin/category/addCategory');
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
    a{
        list-style: none;
        color: #fff;
        text-decoration: none;
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
        margin-left: 260px;
        margin-top: -10px;
    }
    .warn{
        background-color: #F56C6C;
        color: #fff;
        padding: 10px 0;
        border-radius: 5px;
        text-align: center;
        line-height: 30px;
    }
</style>