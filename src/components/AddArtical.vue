<template>
    <el-card  class="box-card">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin/artical' }">文章</el-breadcrumb-item>
            <el-breadcrumb-item>添加文章</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="newArticalInfo" :rules="addArticalRules" ref="addArticalRef" label-width="100px">
            <el-form-item label="分类名称：" prop="articalCategory">
                <el-select placeholder="请选择分类" v-model="articalCategory" @change="selectesCategory">
                    <!-- value为select绑定的值,label 为select选中框内显示的值 -->
                    <el-option :value="item._id" :label="item.categoryname" v-for="item in allCategory" :key="item._id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="articalname" label='文章标题：'>
                <el-input
                    type='text'
                    placeholder="请输入文章题目"
                    v-model="newArticalInfo.articalname"
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item prop="articalDescription" label='文章简介：'>
                <el-input
                    type='text'
                    placeholder="请输入文章简介"
                    v-model="newArticalInfo.articalDescription"
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item prop="articalContent" label='文章正文：'>
                <quill-editor v-model="newArticalInfo.articalContent">
                </quill-editor>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="addArtical">添加文章</el-button>
    </el-card>
</template>

<script>
export default {
    props:['userInfo'],
    data(){
        return{
            // 用于展示分类选择的所有分类
            allCategory:[],
            newArticalInfo:{
                articalUsername:'',
                articalCategory:'',
                articalname:'',
                articalDescription:'',
                articalContent:''
            },
            addArticalRules:{
                articalCategory:[
                    {
                        required:true,
                        message:'请选择文章分类',
                        trigger:'blur'
                    }
                ],
                articalname:[
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
                articalDescription:[
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
                articalContent:[
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
        this.getCategoryList();
        this.newArticalInfo.articalUsername=window.localStorage.getItem('id');
    },
    methods:{
        async getCategoryList(){
           const {data:res}  =await this.$http.get('/admin/allCategory');
           this.allCategory=res.allCategory;
        },
        selectesCategory(){
            this.newArticalInfo.articalCategory=this.articalCategory;
            console.log(this.newArticalInfo.articalCategory);
        },
        addArtical(){
            this.$refs.addArticalRef.validate(async valid=>{
                if(!valid) return;
                const res=await this.$http.post('/admin/artical/addArtical',this.newArticalInfo);
                if(res.data.code===0){
                    this.$router.push('/admin/artical');
                }
            });
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
    .el-breadcrumb{
        margin-bottom: 30px;
    }
    .el-button{
        float: right;
    }
    .el-card{
        height:620px;
        overflow: scroll;
    }

</style>