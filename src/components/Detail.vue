<template>
    <div class="detailAll">
        <el-button type="info" @click="backIndex" class="backIndex">返回</el-button>
        <div class="detail">
            <h1 align=center>{{content.title}}</h1>
            <p align=center style="color:#999">
                分类:
                <span>{{content.categoryname.categoryname}}</span>
                作者:
                <!-- <span class="colInfo">{{item.user.username}}</span>  -->
                时间:
                <span>{{content.addTime | dateFormat}}</span> 
                阅读:
                <span>{{content.views}}</span> 
                评论:
                <span>{{content.comments.length}}</span>
            </p>
            <p style="fontSize:20px" v-html="content.content"></p>
        </div>
        <div class="commentBox">
            <div style="font-size:18px;margin:20px 0"><strong>评论 ({{comments.length}})</strong></div>
            <div style="font-size:18px;margin:10px 0"><strong>{{username}}<span class="admin" v-if="username=='admin'">博主</span></strong></div>
            <div style="margin-bottom:20px">
                <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入内容"
                    v-model="textarea"
                    style="margin-bottom:10px">
                </el-input>
                <!-- 下面这个类型为Hidden的input的作用只是为了方便comment.js获取当前文章的id -->
                <!-- <input type="hidden" id="contentID"> -->
                <el-button type="primary" size="mini" ref="issueBtnRef" @click="issueComment" :disabled='disabled'>发表评论</el-button>
            </div>
            <div style="margin:15px 0;padding-bottom:5px;border-bottom:1px solid #ddd" v-for="(item,index) in comments" :key="index">
                <div style="font-weight:800">{{item.username}}<span class="admin_1" v-if="item.username=='admin'">博主</span></div>
                <div style="margin-top:5px" class="conAtime">
                    <span style="color:#333">{{item.content}}</span>
                    <span style="color:#aaa;font-size:13px">{{item.postTime | dateFormat}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            username:'',
            contentId:'',
            //文章信息
            content:{},
            // 输入的评论
            textarea:'',
            disabled:true,
            // 评论信息
            comments:[]
        }
    },
    created(){
        this.username=window.localStorage.getItem('username');
        this.contentId=this.$route.query.contentId;
        this.getContent();
    },
    // 监听评论输入框中是否有内容，没有内容就禁用发表评论按钮
    watch:{
        textarea(newText,oldText){
            if(newText!==''){
                this.disabled=false;
            }
            if(newText===''){
                this.disabled=true;
            }
        }
    },
    methods:{
        backIndex(){
            this.$router.push('/logined/description');
            this.$emit('cateCard',true);
        },
        async getContent(){
            const {data:res}=await this.$http.get('/logined/detail',{params:{contentId:this.contentId}});
            // console.log(res.content);
            this.content=res.content;
            this.comments=res.content.comments;
            // console.log(this.comments);
        },
        // 发表评论
        async issueComment(){
            const res=await this.$http.post('/logined/detail/comment',{params:{contentId:this.contentId,commentContent:this.textarea,username:this.username,contentTitle:this.content.title,contentCate:this.content.categoryname.categoryname}});
            // console.log(res);
            this.comments=res.data.comments;
            this.textarea='';
            this.getContent();
        }
    }
}
</script>

<style scoped>
    .detailAll{
        /* position: relative; */
        width: 100%;
        height: auto;
    }
    .backIndex{
        position: fixed;
        top: 270px;
        left: 380px;
        z-index: 1;
    }
    .detail{
        width: 750px;
        /* height: 1000px; */
        background-color: #fafafa;
        margin: 10px auto !important;
        border-radius: 20px;
        padding: 5px 20px;
    }
    .detail p span{
        margin-right: 20px;
    }
    .commentBox{
        width: 750px;
        background-color: #fafafa;
        border-radius: 20px;
        padding: 5px 20px;
        margin: 30px 0 32px 5px !important;
    }
    .conAtime{
        display: flex;
        justify-content: space-between;
    }
    .conAtime span:nth-child(1){
        width: 600px;
        word-wrap:break-word;
    }
    .admin,.admin_1{
        display: inline-block;
        padding: 1px 3px 3px 5px;
        background-color: rgb(247, 128, 128);
        font-size: 8px;
        color: #fff;
        border-radius: 5px;
        margin-left: 5px;
        transform:translateY(-2px) ;
        letter-spacing: 2px;
    }
    .admin_1{
        padding: 0px 2px 2px 4px;
        font-size: 6px;
    }
</style>