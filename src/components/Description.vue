<template>
    <div>
        <el-card class="box-card-2">
            <div slot="header" class="clearfix">
                <div style="float:left;margin-top:3px"><strong>文章排列方式</strong></div>
            </div>
            <el-radio-group v-model="radioArtical" @change="arrayChange" class="radioArtical">
                <el-radio-button label="平铺" ></el-radio-button>
                <el-radio-button label="堆叠"></el-radio-button>
            </el-radio-group>
        </el-card>
        <div class="noArtical" v-if="contents==0">没有啦 / 点击下一页</div>
        <div :class="{artical:a_active,artical_new:an_active}" v-for="item in contents" :key="item._id" @click="readDetail(item._id)">
            <h1 align=center>{{item.title}}</h1>
            <p align=center style="color:#999">
                分类:
                <span>{{item.categoryname.categoryname}}</span>
                作者:
                <!-- <span class="colInfo">{{item.user.username}}</span>  -->
                时间:
                <span>{{item.addTime | dateFormat}}</span> 
                阅读:
                <span>{{item.views}}</span> 
                评论:
                <span>{{item.comments.length}}</span>
            </p>
            <p style="fontSize:20px">{{item.description}}</p>
            <el-button type="primary" class="next" @click.stop="nextArtical" v-if="radioArtical=='堆叠'">下一篇</el-button>
        </div>
        <el-pagination
            :class="{leftPagination:left_active,centerPagination:center_active}"
                background
                @current-change="handleCurrentChange"
                :current-page.sync="queryParams.page"
                layout="total,prev, pager, next, jumper"
                :page-size="8"
                :total="total">
            </el-pagination>
    </div>
</template>

<script>
export default {
    // 不使用keep-alive
    // beforeRouteEnter --> created --> mounted --> destroyed
    // 使用keep-alive
    // beforeRouteEnter --> created --> mounted --> activated --> deactivated
    // 再次进入缓存的页面，只会触发beforeRouteEnter -->activated --> deactivated ,  created和mounted不会再执行
    beforeRouteEnter(to, from, next) {
        // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
        // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
        if(from.name=='detail'){
            to.meta.isBack=true;
            //判断是从哪个路由过来的，
            //如果是Detail过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
        }
        next();
    },
    activated() {
        if(!this.$route.meta.isBack || this.isFirstEnter){
            // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
            // 如果isFirstEnter是true，表明是第一次进入此页面或用户刷新了页面，需获取新数据
            this.getArticalList();
        }
        // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
        this.$route.meta.isBack=false
        // 恢复成默认的false，避免isBack一直是true，导致每次都获取新数据
        this.isFirstEnter=false;
        if(this.scroll > 0) {
            window.scrollTo(0, this.scroll); 
            this.scroll = 0;
            window.addEventListener('scroll', this.handleScroll);
        }
   },
   deactivated(){
        window.removeEventListener('scroll', this.handleScroll);
    },
    data(){
        return{
            //文章信息
            contents:[],
            //
            isFirstEnter:false,
            //页面滚动的距离
            scroll:0,
            //数据的总条数
            total:0,
            queryParams:{
                page:1
            },
            queryParamsCate:{
                page:1
            },
            radioArtical:window.localStorage.getItem('radioArtical')||'平铺',
            an_active:window.localStorage.getItem('an_active')==='false'?false:true||true,
            a_active:window.localStorage.getItem('a_active')==='true'?true:false||false,
            left_active:window.localStorage.getItem('left_active')==='false'?false:true||true,
            center_active:window.localStorage.getItem('center_active')==='true'?true:false||false
        }
    },
    props:['cateArticalTotal','cateContents'],
    created(){
        this.getArticalList();
        this.isFirstEnter=true;
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    watch:{
        cateContents(newVal,oldVal){
            this.contents=newVal;
        },
        cateArticalTotal(newVal,oldVal){
            this.total=newVal;
        }
    },
    methods:{
        //获取文章信息
        async getArticalList(){
            const {data:res} =await this.$http.get('/admin/artical',{params:this.queryParams});
            this.contents=res.contents;
            this.total=res.total;
        },
        //阅读原文
        readDetail(contentId){
            if(window.localStorage.getItem('allNew_active')=='true'){
                window.localStorage.setItem('allNew_active',false);
                window.localStorage.setItem('all_active',true);
            }
            this.$router.push({path:'/logined/detail',query:{contentId:contentId}});
            this.$emit('cateCard',false);
        },
        //滚动页面出发事件
        handleScroll () {
            this.scroll  = document.documentElement && document.documentElement.scrollTop;
            // console.log(this.scroll);
        },
        nextArtical(){
            this.contents.splice(0,1);
        },
        //点击页码或者跳转页码时触发
        handleCurrentChange(newPage){
            this.queryParams.page=newPage;
            this.queryParamsCate.page=newPage;
            this.getArticalList();
        },
        arrayChange(){
            window.location.reload();
            if(this.radioArtical=='平铺'){
                // document.querySelector('.nav').style.zIndex='99';
                this.allNew_active=false;
                this.all_active=true;
                this.an_active=true;
                this.a_active=false;
                this.left_active=true;
                this.center_active=false;
                window.localStorage.setItem('radioArtical','平铺');
                window.localStorage.setItem('an_active',true );
                window.localStorage.setItem('a_active',false);
                window.localStorage.setItem('left_active',true );
                window.localStorage.setItem('center_active',false);
            }else{
                // document.querySelector('.nav').style.zIndex='1';
                this.allNew_active=true;
                this.all_active=false;
                this.an_active=false;
                this.a_active=true;
                this.left_active=false;
                this.center_active=true;
                window.localStorage.setItem('radioArtical','堆叠');
                window.localStorage.setItem('an_active',false );
                window.localStorage.setItem('a_active',true);
                window.localStorage.setItem('left_active',false );
                window.localStorage.setItem('center_active',true);
            }
        }
    }
}
</script>

<style scoped>
    .artical_new{
        position: relative;
        top: 0;
        width: 750px;
        height: 300px;
        background-color: #fafafa;
        margin: 20px 25px;
        border-radius: 20px;
        padding:10px 30px;
        box-sizing: border-box;
    }
    .artical_new p span{
        margin-right: 20px;
    }
    .artical_new .el-button{
        position: absolute;
        bottom: 30px;
    }
    .artical_new:hover{
        box-shadow: 5px 5px 10px 5px  rgba(0, 0, 0, .1);
        background-color: #fff;
    }
    .noArtical{
        position: absolute;
        /* position: relative; */
        top: 40%;
        width: 750px;
        height: 300px;
        background-color: transparent;
        margin: 20px 25px;
        border-radius: 20px;
        padding:10px 30px;
        box-sizing: border-box;
        text-align: center;
        line-height: 200px;
    }
    .artical{
        position: absolute;
        top: 0;
        width: 750px;
        height: 300px;
        background-color: #fafafa;
        margin: 20px 25px;
        border-radius: 20px;
        padding:10px 30px;
        box-sizing: border-box;
    }
    .artical:nth-child(2){
        background-color: #fff;
        top: 340px;
        z-index: 11;
        transition:all 0.5s;
    }
    .artical:nth-child(3){
        top: 320px;
        z-index: 10;
        transform: scale(0.95);
        opacity:0.9;
        transition:all 0.5s;
    }
    .artical:nth-child(4){
        top:300px;
        z-index: 9;
        transform: scale(0.9);
        opacity:0.8;
        transition:all 0.5s;
    }
    .artical:nth-child(5){
        top: 280px;
        z-index: 8;
        transform: scale(0.85);
        opacity:0.7;
        transition:all 0.5s;
    }
    .artical:nth-child(6){
        top: 260px;
        z-index: 7;
        transform: scale(0.8);
        opacity:0.6;
        transition:all 0.5s;
    }
    .artical:nth-child(7){
        top: 240px;
        z-index: 6;
        transform: scale(0.75);
        opacity:0.5;
        transition:all 0.5s;
    }
    .artical:nth-child(8){
        top: 220px;
        z-index: 5;
        transform: scale(0.7);
        opacity:0.4;
        transition:all 0.5s;
    }
    .artical:nth-child(9){
        top: 200px;
        z-index: 4;
        transform: scale(0.65);
        opacity:0.3;
        transition:all 0.5s;
    }
    .artical:hover{
        box-shadow: 5px 5px 10px 5px  rgba(0, 0, 0, .1);
        background-color: #fff;
        opacity: 1;
        margin-top: -60px;
    }
    .artical p span{
        margin-right: 20px;
    }
    .artical .el-button{
        position: absolute;
        bottom: 30px;
    }
    .next{
        position: absolute;
        right: 30px;
    }
    .box-card-2 {
        position: fixed;
        top: 200px;
        left: 60px;
        width: 240px;
        border-radius: 15px;
    }
    .radioArtical{
        padding-left: 30px;
    }
    .el-radio-group{
        margin: 12px 0;
    }
    .centerPagination,.leftPagination{
        position: fixed;
        left: 50%;
        bottom: 5px;
        transform:translateX(-50%);
        min-width: 300px;
        height:30px;
        background-color: rgba(146, 142, 142, 0.4);
        border-radius: 10px;
        padding: 10px 20px;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
</style>