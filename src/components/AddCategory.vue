<template>
    <el-card class="box-card" style="height:620px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/category' }">分类</el-breadcrumb-item>
        <el-breadcrumb-item>添加分类</el-breadcrumb-item>
      </el-breadcrumb>
      <el-form :model="newCategoryInfo" :rules="addCategoryRules" ref="addCategoryRef" label-width="100px">
        <el-form-item prop="categoryname" label='分类名称：'>
          <el-input
            type='text'
            placeholder="请输入分类名称"
            v-model="newCategoryInfo.categoryname"
            clearable>
          </el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="addCategory">添加分类</el-button>
    </el-card>
</template>

<script>
export default {
    data() {
      return {
        newCategoryInfo:{
          categoryname:''
        },
        addCategoryRules:{
          categoryname:[
            {
              required:true,
              message:'请输入分类名称',
              trigger:'blur'
            },
            {
              min:1,
              max:6,
              trigger:'blur'
            }
          ]
        }
      }
    },
    methods:{
      addCategory(){
        this.$refs.addCategoryRef.validate( async valid=>{
          if(!valid) return;
          const result= await this.$http.post('/admin/category/addCategory',this.newCategoryInfo);
          // console.log(result);
          this.$router.push('/admin/category');
        });
      }
    }
}
</script>

<style scoped>
  .el-breadcrumb{
    margin-bottom: 30px;
  }
  .el-button{
    float: right;
  }
</style>