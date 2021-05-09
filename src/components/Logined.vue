<template>
    <div :class="{all:all_active,all_new:allNew_active}">
        <div class="titleParent">
            <div :class="{'title':title,'titlePic1':titlePic1,'titlePic2':titlePic2,'titlePic3':titlePic3,'titlePic4':titlePic4}" @mousemove="bgMove" :style="{'background-color':color_1}">
                <span :style="{'color':color_2}">HiBlog</span>
            </div>
        </div>
        <div class="center">
            <el-container>
                <el-header>
                    <div :class="{nav:nav_active,nav_new:navNew_active}">
                        <el-menu
                            class="el-menu-demo"
                            mode="horizontal"
                            :background-color="bgc"
                            text-color="#fff"
                            active-text-color="#rgb(0,0,0)">
                            <el-menu-item index="1" @click="clickItem('-1','1','-1')" :style="{fontWeight:isBold_1,fontSize:isLarge_1}">首页</el-menu-item>
                            <el-submenu index="2">
                                <template slot="title" :style="{fontWeight:isBold_2,fontSize:isLarge_2}">
                                分类 
                                    <strong style="font-size:20px;display:inline-block;margin-top:-5px" v-if="navCateDisplay">
                                    {{selectCate}}
                                    </strong>
                                    <strong style="font-size:20px;display:inline-block;margin-top:-5px" v-if="!navCateDisplay">
                                    {{adCate}}
                                    </strong>
                                </template>
                                <el-menu-item :index="'2-'+i" v-for="(item,i) in allCategory" :key="item._id" @click="clickItem(i,'2',item._id)">{{item.categoryname}}</el-menu-item>
                            </el-submenu>

                            <el-button id="logout" style="margin-left: 16px;background-color:rgba(0,0,0,0.2);border-color:rgba(0,0,0,0.2)" size="medium" @click="logout">退出登录</el-button>
                        </el-menu>
                    </div>
                </el-header>
                <!-- 用户信息卡片 -->
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span><strong>用户信息</strong></span>
                    </div>
                    <div class="text item">
                        用户名：<span><strong>{{userInfo.username}}</strong></span><span class="admin" v-if="userInfo.username=='admin'">管理员</span>
                    </div>
                    <div class="text item" v-if="userInfo.username!=='admin'">
                        权限：<span class="admin_1">普通用户</span>
                    </div>
                    <div v-if="userInfo.isAdmin==='true'">
                        <el-button type="primary" size="mini" @click="goAdmin">进入后台</el-button>
                    </div>
                </el-card>
                <el-card class="box-card-1">
                    <div slot="header" class="clearfix">
                        <div style="float:left;margin-top:3px"><strong>换肤</strong></div>
                        <el-button type="info" size="mini" style="float:left;margin-left:150px" @click="origin">默认</el-button>
                    </div>
                    <el-radio-group v-model="radio" size="medium" @change="bgChange">
                        <el-radio-button label="纯色" ></el-radio-button>
                        <el-radio-button label="图片"></el-radio-button>
                    </el-radio-group>
                    <div class='color-box' v-if="radio==='纯色'">
                        <div class="color-1">
                            <div>背景色</div>
                            <el-color-picker v-model="color_1" show-alpha @change="changeColor_1"></el-color-picker>
                        </div>
                        <div class="color-2">
                            <div>文字颜色</div>
                            <el-color-picker v-model="color_2" show-alpha @change="changeColor_2"></el-color-picker>
                        </div>
                    </div>
                    <div class="pic-box" v-if="radio==='图片'">
                        <el-radio-group size='small' v-model="radioPic" @change="picChange">
                            <el-radio-button label="雪山"></el-radio-button>
                            <el-radio-button label="城市"></el-radio-button>
                            <el-radio-button label="黄昏"></el-radio-button>
                            <el-radio-button label="星空"></el-radio-button>
                        </el-radio-group>
                        <div class="color-2">
                            <div>文字颜色</div>
                            <el-color-picker v-model="color_2" show-alpha @change="changeColor_2"></el-color-picker>
                        </div>
                    </div>
                </el-card>
                <el-card class="box-card-2" v-if="isCateCardDisplay">
                    <div slot="header" class="clearfix">
                        <div style="float:left;margin-top:3px"><strong>推荐分类</strong></div>
                    </div>
                    <div class="cate" v-for="(item,index) in numCateArray" :key="index" @click="clickCate(item._id,item.categoryname)">{{item.categoryname}}</div>
                </el-card>
                
                <el-main>
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive" :cateArticalTotal="cateArticalTotal" :cateContents="cateContents" @cateCard="cateCardDisplayFalse">
                        <!-- 这里是会被缓存的视图组件，比如 page1,page2 -->
                        </router-view>
                    </keep-alive>

                    <router-view v-if="!$route.meta.keepAlive" @cateCard="cateCardDisplayTrue">
                        <!-- 这里是不被缓存的视图组件，比如 page3 -->
                    </router-view>
                </el-main>
            </el-container>
        </div>
    </div>
</template>

<script>
// import eventBus from '../js/eventBus'; 
export default {
    data() {
        return {
            // 被选中的分类
            selectCate:'',
            visible: false,
            //登录用户的用户信息
            userInfo:{},
            isBold_1:'1000',
            isBold_2:'normal',
            isLarge_1:'20px',
            isLarge_2:'14px',
            navCateDisplay:'',
            adCate:'',
            numCateArray:[],
            isCateCardDisplay:true,
            //所有的分类
            allCategory:[],
            // 纯色主题的默认主题
            radio:window.localStorage.getItem('radio') || '纯色',
            // 图片主题的默认主题
            radioPic:window.localStorage.getItem('radioPic') || '雪山',
            // 导航栏的颜色
            bgc:window.localStorage.getItem('bgc') || '#3C6382',
            // 纯色主题的颜色
            color_1: window.localStorage.getItem('color_1') || '#3C6382',
            // logo的颜色
            color_2:window.localStorage.getItem('color_2') || '#fff',
            title:true,
            titlePic1:window.localStorage.getItem('titlePic1')==='true'?true:false || false,
            titlePic2:window.localStorage.getItem('titlePic2')==='true'?true:false || false,
            titlePic3:window.localStorage.getItem('titlePic3')==='true'?true:false || false,
            titlePic4:window.localStorage.getItem('titlePic4')==='true'?true:false || false,

            allNew_active:window.localStorage.getItem('allNew_active')==='true'?true:false||false,
            all_active:window.localStorage.getItem('all_active')==='false'?false:true||true,
            left_acive:window.localStorage.getItem('left_active')==='false'?false:true||true,
            center_active:window.localStorage.getItem('center_active')==='true'?true:false||false,
            nav_active:window.localStorage.getItem('nav_active')==='false'?false:true||true,
            navNew_active:window.localStorage.getItem('navNew_active')==='true'?true:false||false,

            cateArticalTotal:0,
            cateContents:''
        };
    },
    created(){
        // console.log(this.$route.query);
        // 在未登录的页面通过this.router.push()方法跳转到登录之后的页面，并携带登录用户的信息
        // this.userInfo=this.$route.query;
        this.userInfo.username=window.localStorage.getItem('username');
        this.userInfo.isAdmin=window.localStorage.getItem('isAdmin');
        // console.log(this.userInfo);
        // console.log(typeof this.userInfo.isAdmin);
        this.getCategoryList();
    },
    updated(){
        if(window.localStorage.getItem('radioArtical')=='平铺'){
            this.allNew_active=false;
            this.all_active=true;
            this.nav_active=true;
            this.navNew_active=false;
            window.localStorage.setItem('allNew_active',false);
            window.localStorage.setItem('all_active',true);
            window.localStorage.setItem('nav_active',true );
            window.localStorage.setItem('navNew_active',false);
        }else if(window.localStorage.getItem('radioArtical')=='堆叠'){
            this.allNew_active=true;
            this.all_active=false;
            this.nav_active=false;
            this.navNew_active=true;
            window.localStorage.setItem('allNew_active',true);
            window.localStorage.setItem('all_active',false);
            window.localStorage.setItem('nav_active',false );
            window.localStorage.setItem('navNew_active',true);
        }
    },
    methods: {
        //获取所有分类
        async getCategoryList(){
            const {data:res}  =await this.$http.get('/admin/allCategory');
            this.allCategory=res.allCategory;
            var numArray=[];
            this.numCateArray=[];
            if(this.allCategory.length>5){
                while(numArray.length<5){
                    var num=Math.floor(Math.random()*this.allCategory.length);
                    if(numArray.indexOf(num)==-1){
                        numArray.push(num);
                    }
                }
                for(let j=0;j<numArray.length;j++){
                    this.numCateArray.push(this.allCategory[numArray[j]]);
                }
            }else{
                for(let i=0;i<this.allCategory.length;i++){
                    numArray.push(Math.floor(Math.random()*this.allCategory.length));
                }
            }
        },
        //退出登录
        logout(){
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('username');
            window.localStorage.removeItem('isAdmin');
            this.$router.push('/');
        },
        //管理员账号点击进入后台按钮进入后台
        goAdmin(){
            this.$router.push('/admin');
        },
        //切换纯色和图片时触发
        bgChange(){
            if(this.radio==='图片'&&this.radioPic==='雪山'){
                document.querySelector('.title').className='title titlePic1';
                this.titlePic1=true;
                window.localStorage.setItem('radioPic','雪山');
                window.localStorage.setItem('titlePic1','true');
                window.localStorage.setItem('titlePic2','false');
                window.localStorage.setItem('titlePic3','false');
                window.localStorage.setItem('titlePic4','false');
                this.bgc='#B1D7EE';
                window.localStorage.setItem('bgc','#B1D7EE');
                window.localStorage.setItem('radio','图片');
            }
            if(this.radio==='图片'&&this.radioPic==='城市'){
                document.querySelector('.title').className='title titlePic2';
                this.titlePic2=true;
                window.localStorage.setItem('radioPic','城市');
                window.localStorage.setItem('titlePic2','true');
                window.localStorage.setItem('titlePic1','false');
                window.localStorage.setItem('titlePic3','false');
                window.localStorage.setItem('titlePic4','false');
                this.bgc='#015095';
                window.localStorage.setItem('bgc','#015095');
                window.localStorage.setItem('radio','图片');
            }
            if(this.radio==='图片'&&this.radioPic==='黄昏'){
                document.querySelector('.title').className='title titlePic3';
                this.titlePic3=true;
                window.localStorage.setItem('radioPic','黄昏');
                window.localStorage.setItem('titlePic3','true');
                window.localStorage.setItem('titlePic2','false');
                window.localStorage.setItem('titlePic1','false');
                window.localStorage.setItem('titlePic4','false');
                this.bgc='#FEB4C3';
                window.localStorage.setItem('bgc','#FEB4C3');
                window.localStorage.setItem('radio','图片');
            }
            if(this.radio==='图片'&&this.radioPic==='星空'){
                document.querySelector('.title').className='title titlePic4';
                this.titlePic4=true;
                window.localStorage.setItem('radioPic','星空');
                window.localStorage.setItem('titlePic4','true');
                window.localStorage.setItem('titlePic2','false');
                window.localStorage.setItem('titlePic3','false');
                window.localStorage.setItem('titlePic1','false');
                this.bgc='#C9507D';
                window.localStorage.setItem('bgc','#C9507D');
                window.localStorage.setItem('radio','图片');
            }
            if(this.radio==='纯色'){
                document.querySelector('.title').className='title';
                this.bgc=this.color_1;
                window.localStorage.setItem('bgc',this.color_1);
                window.localStorage.setItem('titlePic1','false');
                window.localStorage.setItem('titlePic2','false');
                window.localStorage.setItem('titlePic3','false');
                window.localStorage.setItem('titlePic4','false');
                window.localStorage.setItem('radio','纯色');
            }
        },
        //选择背景颜色时触发
        changeColor_1(){
            document.querySelector('.title').style.background=this.color_1;
            window.localStorage.setItem('color_1',this.color_1);
            this.bgc=this.color_1;
            window.localStorage.setItem('bgc',this.color_1);
        },
        //选择文字颜色时触发
        changeColor_2(){
            document.querySelector('.title span').style.color=this.color_2;
            window.localStorage.setItem('color_2',this.color_2);
        },
        //切换不同背景图时触发
        picChange(){
            if(this.radioPic==='雪山'){
                document.querySelector('.title').className='title titlePic1';
                this.bgc='#B1D7EE';
                window.localStorage.setItem('radioPic','雪山');
                window.localStorage.setItem('bgc','#B1D7EE');
                window.localStorage.setItem('titlePic1','true');
                window.localStorage.setItem('titlePic2','false');
                window.localStorage.setItem('titlePic3','false');
                window.localStorage.setItem('titlePic4','false');
            }
            if(this.radioPic==='城市'){
                document.querySelector('.title').className='title titlePic2';
                this.bgc='#015095';
                window.localStorage.setItem('radioPic','城市');
                window.localStorage.setItem('bgc','#015095');
                window.localStorage.setItem('titlePic2','true');
                window.localStorage.setItem('titlePic1','false');
                window.localStorage.setItem('titlePic3','false');
                window.localStorage.setItem('titlePic4','false');
            }
            if(this.radioPic==='黄昏'){
                document.querySelector('.title').className='title titlePic3';
                this.bgc='#FEB4C3';
                window.localStorage.setItem('radioPic','黄昏');
                window.localStorage.setItem('bgc','#FEB4C3');
                window.localStorage.setItem('titlePic3','true');
                window.localStorage.setItem('titlePic2','false');
                window.localStorage.setItem('titlePic4','false');
                window.localStorage.setItem('titlePic1','false');
            }
            if(this.radioPic==='星空'){
                document.querySelector('.title').className='title titlePic4';
                this.bgc='#C9507D';
                window.localStorage.setItem('radioPic','星空');
                window.localStorage.setItem('bgc','#C9507D');
                window.localStorage.setItem('titlePic4','true');
                window.localStorage.setItem('titlePic2','false');
                window.localStorage.setItem('titlePic3','false');
                window.localStorage.setItem('titlePic1','false');
            }
        },
        // 还原皮肤
        origin(){
            window.localStorage.removeItem('titlePic1');
            window.localStorage.removeItem('titlePic2');
            window.localStorage.removeItem('titlePic3');
            window.localStorage.removeItem('titlePic4');
            window.localStorage.removeItem('bgc');
            window.localStorage.removeItem('radio');
            window.localStorage.removeItem('radioPic');
            window.localStorage.removeItem('color_1');
            window.localStorage.removeItem('color_2');
            window.location.reload();
        },
        //鼠标在背景图上移动时，背景图也随之移动
        bgMove(e){
            var x=e.clientX;
            var y=e.clientY;
            var bg=document.querySelector('.title');
            bg.style.backgroundPositionX=-x+'px';
            bg.style.backgroundPositionY=-y+'px';
        },
        //获取文章信息
        async getArticalList(){
            var queryParams={};
            queryParams.page=1;
            const {data:res} =await this.$http.get('/admin/artical',{params:queryParams});
            this.cateContents=res.contents;
            this.cateArticalTotal=res.total;
        },
        async clickItem(i,i_1,id){
            // console.log(id);
            if(i_1=='2'&&i!=-1&&id!='-1'){
                this.navCateDisplay=true;
                this.isBold_1='normal';
                this.isBold_2='1000';
                this.isLarge_1='14px';
                this.isLarge_2='20px';
                this.selectCate=this.allCategory[i].categoryname;
                var queryParams={};
                queryParams.page=1;
                queryParams.id=id;
                const {data:res}=await this.$http.get('/admin/artical/cateArtical',{params:queryParams});
                this.cateContents=res.contents;
                this.cateArticalTotal=res.total;
            }else if(i=='-1'&&i_1=='1'&&id=='-1'){
                this.navCateDisplay=true;
                this.isBold_1='1000';
                this.isBold_2='normal';
                this.isLarge_1='20px';
                this.isLarge_2='14px';
                this.selectCate='';
                this.getArticalList();
            } 
        },
        cateCardDisplayFalse(data){
            // console.log(data);
            this.isCateCardDisplay=data;
        },
        cateCardDisplayTrue(data){
            this.isCateCardDisplay=data;
        },
        async clickCate(id,name){
            // console.log(id);
            var queryParams={};
            queryParams.page=1;
            queryParams.id=id;
            const {data:res}=await this.$http.get('/admin/artical/cateArtical',{params:queryParams});
            this.cateContents=res.contents;
            this.cateArticalTotal=res.total;
            this.isBold_1='normal';
            this.isBold_2='normal';
            this.isLarge_1='14px';
            this.isLarge_2='14px';
            this.navCateDisplay=false;
            this.adCate=name;
        }
    }
}
</script>

<style scoped>
    .all{
        background-color:  #e1e1e1;
        min-height: 100%;
    }
    .all_new{
        background-color:  #e1e1e1;
        min-height: 100%;
    }
    .titleParent{
        position: relative;
        height: 180px;
    }
    .title{
        position: fixed;
        width: 100%;
        height: 180px;
        z-index: 9;
    }
    .titlePic1{
        background-image: url(../../public/img/bg22.jpg) !important;
        background-size: 4000px auto !important;
        background-position: 0 0;
        z-index: 11;
    }
    .titlePic2{
        background-image: url(../../public/img/bg33.jpg) !important;
        background-size: 4000px auto !important;
        background-position: 0 0;
    }
    .titlePic3{
        background-image: url(../../public/img/bg44.jpg) !important;
        background-size: 4000px auto !important;
        background-position: 0 0;
    }
    .titlePic4{
        background-image: url(../../public/img/bg55.jpg) !important;
        background-size: 4000px auto !important;
        background-position: 0 0;
    }
    .title span{
        display: block;
        text-align: center;
        line-height: 180px;
        font-size: 50px;
        font-weight: 1000;
        color: #fafafa;
    }
    .center{
        width: 800px;
        margin: 0 auto;
    }
    .nav{
        position: fixed;
        width: 800px;
        z-index: 99;
    }
    .nav_new{
        position: fixed;
        width: 800px;
        z-index: 1;
    }
    .el-header,.el-main{
        padding: 0;
        margin-top: 20px;
    }
    .el-menu{
        padding: 0 15px;
        border-radius: 15px;
        box-shadow: 0px 5px 10px 0px rgba(87, 87, 87, 0.5);
    }
    .el-menu.el-menu--horizontal{
        border: none;
    }
    /* .el-main{
        margin-top: 20px !important;
    } */
    #logout{
        margin: 13px 20px 12px 0;
        float: right;
        color: #fff;
    }
    /* 卡片默认样式 */
    .text {
    font-size: 14px;
    }
    .item {
        margin-bottom: 18px;
    }
    .radio{
        margin-left: 15px;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .box-card {
        position: fixed;
        top: 200px;
        right: 50px;
        width: 280px;
        border-radius: 15px;
    }

    .box-card .el-button{
        margin: 5px 0;
    }

    .box-card-1 {
        position: fixed;
        top: 390px;
        right: 50px;
        width: 280px;
        border-radius: 15px;
    }
    .box-card-2{
        position: fixed;
        top: 380px;
        left: 60px;
        width: 240px;
        border-radius: 15px;
    }
    .box-card-2 .cate{
        background-color: rgb(250, 250, 250);
        border-radius: 10px;
        box-shadow: 0px 3px 3px 0px rgba(146, 142, 142, 0.2);
        margin-bottom: 10px;
        padding: 5px 0;
        text-align: center;
    }
    .cate:nth-last-child(1){
        margin-bottom: 0;
    }
    .box-card-2 .cate:hover{
        background-color: #fff;
        transform: scale(1.1);
        cursor: pointer;
        box-shadow: 0px 0px 8px 4px rgba(146, 142, 142, 0.3);
    }
    .color-box{
        height: 60px;
        margin: 10px 0;
    }
    .color-1,.color-2{
        float: left;
        margin-right: 30px;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    .el-radio-group{
        margin: 12px 0;
    }
    .detail{
        margin: 100px auto;
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
        background-color: #909399;
    }
</style>