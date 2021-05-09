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
                        active-text-color="#rgb(0,0,0)"
                        >
                        <el-menu-item index="1" @click="clickItem('-1','1','-1')" :style="{fontWeight:isBold_1,fontSize:isLarge_1}">首页</el-menu-item>
                        <el-submenu index="2">
                            <template slot="title" :style="{fontWeight:isBold_2,fontSize:isLarge_2}">
                            分类   
                                <strong style="font-size:20px;display:inline-block;margin-top:-5px"     v-if="navCateDisplay">
                                {{selectCate}}
                                </strong>
                                <strong style="font-size:20px;display:inline-block;margin-top:-5px" v-if="!navCateDisplay">
                                {{adCate}}
                                </strong>
                            </template>
                            <el-menu-item :index="'2-'+i" v-for="(item,i) in allCategory" :key="item._id" @click="clickItem(i,'2',item._id)">
                                {{item.categoryname}}
                            </el-menu-item>
                        </el-submenu>

                        <el-button @click="drawer = true;loginBoxShow" type="info" style="margin-left: 16px;background-color:rgba(0,0,0,0.2);border-color:rgba(0,0,0,0.2)" size="medium" id="log" ref="loginRegisterBtnRef">
                            登录 / 注册
                        </el-button>
                        <!-- <el-button type="warning" id="logout" style="margin-left: 16px;" size="medium">退出登录</el-button> -->

                        <el-drawer
                            title="我是标题"
                            :visible.sync="drawer"
                            :with-header="false"
                            :append-to-body="true"
                            :modal-append-to-body="false">
                            <!-- 登录面板 -->
                            <div class="loginBox" ref="loginBoxRef">
                                <h1 class="loginTitle">登录</h1>
                                <div class="tips" ref="tipsRef">用户名或密码错误</div>
                                <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="80px" class="login">
                                    <el-form-item label="用户名" prop="username">
                                        <el-input type="text" placeholder="请输入用户名" v-model="loginForm.username"></el-input>
                                    </el-form-item>
                                    <el-form-item label="密码" prop="password">
                                        <el-input type="password" placeholder="请输入密码" v-model="loginForm.password"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button  type="primary" class="loginBtn" @click="login">登录</el-button>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="info" class="loginReset" @click="resetLoginForm">重置</el-button>
                                        <el-button type="success" class="loginRegister" @click="goRegister">去注册</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <!-- 注册面板 -->
                            <div class="registerBox" style="display:none" ref="registerBoxRef" >
                                <h1 class="registerTitle">注册</h1>
                                <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" label-width="80px" class="register">
                                    <el-form-item label="用户名" prop="username">
                                        <el-input type="text" placeholder="请输入用户名" v-model="registerForm.username"></el-input>
                                    </el-form-item>
                                    <el-form-item label="密码" prop="password">
                                        <el-input type="password" placeholder="请输入密码" v-model="registerForm.password"></el-input>
                                    </el-form-item>
                                    <el-form-item label="确认密码" prop="rePassword">
                                        <el-input type="password" placeholder="请再次输入密码" v-model="registerForm.rePassword"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button  type="success" class="registerBtn" @click="register">注册</el-button>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="info" class="registerReset" @click="resetRegisterForm">重置</el-button>
                                        <el-button type="primary" class="registerLogin" @click="goLogin">去登录</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-drawer>
                    </el-menu>
                    </div>
                </el-header>
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
                <el-card class="box-card-2">
                    <div slot="header" class="clearfix">
                        <div style="float:left;margin-top:3px"><strong>文章排列方式</strong></div>
                    </div>
                    <el-radio-group v-model="radioArtical" @change="arrayChange" class="radioArtical">
                        <el-radio-button label="平铺" ></el-radio-button>
                        <el-radio-button label="堆叠"></el-radio-button>
                    </el-radio-group>
                </el-card>
                <el-card class="box-card-3">
                    <div slot="header" class="clearfix">
                        <div style="float:left;margin-top:3px"><strong>推荐分类</strong></div>
                    </div>
                    <div class="cate" v-for="(item,index) in numCateArray" :key="index" @click="clickCate(item._id,item.categoryname)">{{item.categoryname}}</div>
                </el-card>
                <el-main>
                    <div class="noArtical" v-if="contents==0">没有啦 / 点击下一页</div>
                    <div :class="{artical:a_active,artical_new:an_active}" v-for="item in contents" :key="item._id" @click="readDetail">
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
                        <el-button type="primary">登录阅读全文</el-button>
                        <el-button type="primary" class="next" @click.stop="nextArtical" v-if="radioArtical=='堆叠'">下一篇</el-button>
                    </div>
                    
                    <router-view></router-view>
                </el-main>
            </el-container>
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
    </div>
</template>

<script>
export default {
    data() {
        //验证第二次输入的密码是否与第一次输入的密码一致的规则
        var validateRepassword = (rule, value, callback) => {
            if (value !== this.registerForm.password) {
                callback(new Error("两次输入密码不一致"));
            } else {
                callback();
            }
        };
        return {
            // 被选中的分类
            selectCate:'',
            // 侧边登录注册栏的显示与隐藏
            drawer: false,
            visible: false,
            isBold_1:'1000',
            isBold_2:'normal',
            isLarge_1:'20px',
            isLarge_2:'14px',
            navCateDisplay:'',
            adCate:'',
            numCateArray:[],
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
            // 
            title:true,
            // 
            titlePic1:window.localStorage.getItem('titlePic1')==='true'?true:false || false,
            // 
            titlePic2:window.localStorage.getItem('titlePic2')==='true'?true:false || false,
            // 
            titlePic3:window.localStorage.getItem('titlePic3')==='true'?true:false || false,
            // 
            titlePic4:window.localStorage.getItem('titlePic4')==='true'?true:false || false,
            //登录表单的数据绑定对象
            loginForm:{
                username:'',
                password:''
            },
            //登录表单的表单验证规则对象
            loginFormRules:{
                username:[{
                    required:true,
                    message:'用户名不能为空',
                    trigger:'blur'
                },{
                    min:2,
                    max:8,
                    message:'用户名长度在2~8之间',
                    trigger:'blur'
                }],
                password:[{
                    required:true,
                    message:'密码不能为空',
                    trigger:'blur'
                },{
                    min:6,
                    max:16,
                    message:'密码长度在6~16之间',
                    trigger:'blur'
                }]
            },
            //注册表单的数据绑定对象
            registerForm:{
                username:'',
                password:'',
                rePassword:''
            },
            //注册表单的表单验证规则对象
            registerFormRules:{
                username:[{
                    required:true,
                    message:'用户名不能为空',
                    trigger:'blur'
                },{
                    min:2,
                    max:8,
                    message:'用户名长度在2~8之间',
                    trigger:'blur'
                }],
                password:[{
                    required:true,
                    message:'密码不能为空',
                    trigger:'blur'
                },{
                    min:6,
                    max:16,
                    message:'密码长度在6~16之间',
                    trigger:'blur'
                }],
                rePassword:[{
                    required:true,
                    message:'密码不能为空',
                    trigger:'blur'
                },{
                    validator:validateRepassword,
                    trigger:'blur'
                }]
            },
            //卡片中的用户名
            cardUsername:'',
            //文章信息
            contents:[],
            //分类信息
            allCategory:[],
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
            allNew_active:window.localStorage.getItem('allNew_active')==='true'?true:false||false,
            all_active:window.localStorage.getItem('all_active')==='false'?false:true||true,
            left_active:window.localStorage.getItem('left_active')==='false'?false:true||true,
            center_active:window.localStorage.getItem('center_active')==='true'?true:false||false,
            nav_active:window.localStorage.getItem('nav_active')==='false'?false:true||true,
            navNew_active:window.localStorage.getItem('navNew_active')==='true'?true:false||false
        };
    },
    created(){
        this.getArticalList();
        this.getCategoryList();
    },
    methods: {
        //点击导航栏的登录/注册按钮时，右侧边展示登录面板，并重置登录和注册面板的信息
        loginBoxShow(){
            // document.querySelector('.loginBox').style.display='block';
            // document.querySelector('.registerBox').style.display='none';
            // console.log(this);
            this.$refs.loginFormRef.resetFields();
            this.$refs.registerFormRef.resetFields();
            this.$refs.loginBoxRef.style.display='block';
            this.$refs.registerBoxRef.style.display='none';
            this.$refs.tipsRef.style.display='none';
        },
        //点击去注册按钮，展示注册面板，并重置登录面板的信息
        goRegister(){
            this.$refs.loginFormRef.resetFields();
            this.$refs.loginBoxRef.style.display='none';
            this.$refs.registerBoxRef.style.display='block';
        },
        //点击去登录按钮，展示登录面板，并重置注册面板的信息
        goLogin(){
            this.$refs.registerFormRef.resetFields();
            this.$refs.loginBoxRef.style.display='block';
            this.$refs.registerBoxRef.style.display='none';
            this.$refs.tipsRef.style.display='none';
        },
        //重置登录面板的信息
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
            this.$refs.tipsRef.style.display='none';
        },
        //重置注册面板的信息
        resetRegisterForm(){
            this.$refs.registerFormRef.resetFields();
        },
        //点击登录按钮
        login(){
            this.$refs.loginFormRef.validate(async valid=>{
                // console.log(valid);//如果表单通过预校验，valid的值为true，否则为false
                if(!valid) return;
                const {data:res} = await this.$http.post('/user/login',this.loginForm);
                // console.log(res);//res中有一个userInfo属性，是一个对象，包含用户名、id、是否为管理和token
                if(res.code!==0){
                    this.$refs.tipsRef.style.display='block';
                }
                else if(res.code===0){
                    window.localStorage.setItem('token', res.userInfo.token);
                    window.localStorage.setItem('username', res.userInfo.username);
                    window.localStorage.setItem('isAdmin', res.userInfo.isAdmin);
                    window.localStorage.setItem('id', res.userInfo.id);
                    // console.log(window.localStorage.getItem('token'));
                    this.drawer=false;
                    // console.log(res);
                    this.$router.push('/logined');
                }
            });
        },
        //点击注册按钮
        register(){
            this.$refs.registerFormRef.validate( async valid=>{
                // console.log(valid);//如果表单通过预校验，valid的值为true，否则为false
                if(!valid) return;
                // const result = await this.$http.post('/user/register',this.registerForm);
                // console.log(result);//result就是服务器端返回的数据的对象，并且axios已经封装为6个属性，其中一个属性是data，data属性的值一般就是我们想要的数据，因为result数据对象中的data属性的值是我们最想要的数据，因此就把data属性解构出来，如上一句代码const {data:res}，意思就是将result对象中的data属性解构为res
                const {data:res} = await this.$http.post('/user/register',this.registerForm);
                // console.log(res);//输出一下在result对象中解构出来的data属性
                if(res.code===0){
                    //在后端中设置的code如果为零表示注册成功，如果code为非零表示注册失败
                    //注册成功后，跳转到登录后的页面
                    this.drawer=false;
                    this.resetRegisterForm();
                    // document.querySelector('#log').style.display='none';
                    // document.querySelector('#logout').style.display='block';
                    document.querySelector('.box-card').style.display='none';
                }
            });
        },
        //获取文章信息
        async getArticalList(){
            const {data:res} =await this.$http.get('/admin/artical',{params:this.queryParams});
            this.contents=res.contents;
            this.total=res.total;
        },
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
        //点击文章卡片，进入完整的文章页面
        readDetail(){
            //未登录用户点击文章卡片不能阅读全文，并弹出登录面板
            this.drawer=true;
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
        //鼠标在背景图上移动时，背景图也随之移动
        bgMove(e){
            var x=e.clientX;
            var y=e.clientY;
            var bg=document.querySelector('.title');
            bg.style.backgroundPositionX=-x+'px';
            bg.style.backgroundPositionY=-y+'px';
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
        arrayChange(){
            if(this.radioArtical=='平铺'){
                // document.querySelector('.nav').style.zIndex='99';
                this.allNew_active=false;
                this.all_active=true;
                this.an_active=true;
                this.a_active=false;
                this.left_active=true;
                this.center_active=false;
                this.nav_active=true;
                this.navNew_active=false;
                window.localStorage.setItem('radioArtical','平铺');
                window.localStorage.setItem('allNew_active',false);
                window.localStorage.setItem('all_active',true);
                window.localStorage.setItem('an_active',true );
                window.localStorage.setItem('a_active',false);
                window.localStorage.setItem('left_active',true );
                window.localStorage.setItem('center_active',false);
                window.localStorage.setItem('nav_active',true );
                window.localStorage.setItem('navNew_active',false);
            }else{
                // document.querySelector('.nav').style.zIndex='1';
                this.allNew_active=true;
                this.all_active=false;
                this.an_active=false;
                this.a_active=true;
                this.left_active=false;
                this.center_active=true;
                this.nav_active=false;
                this.navNew_active=true;
                window.localStorage.setItem('radioArtical','堆叠');
                window.localStorage.setItem('allNew_active',true);
                window.localStorage.setItem('all_active',false);
                window.localStorage.setItem('an_active',false );
                window.localStorage.setItem('a_active',true);
                window.localStorage.setItem('left_active',false );
                window.localStorage.setItem('center_active',true);
                window.localStorage.setItem('nav_active',false );
                window.localStorage.setItem('navNew_active',true);
            }
        },
        //点击页码或者跳转页码时触发
        handleCurrentChange(newPage){
            this.queryParams.page=newPage;
            this.queryParamsCate.page=newPage;
            this.getArticalList();
        },
        nextArtical(){
            this.contents.splice(0,1);
        },
        async clickItem(i,i_1,id){
            if(i_1=='2'&&i!=-1&&id!='-1'){
                this.navCateDisplay=true;
                this.isBold_1='normal';
                this.isBold_2='1000';
                this.isLarge_1='14px';
                this.isLarge_2='20px';
                this.selectCate=this.allCategory[i].categoryname;
                this.queryParamsCate.id=id;
                const {data:res}=await this.$http.get('/admin/artical/cateArtical',{params:this.queryParamsCate});
                this.contents=res.contents;
                this.total=res.total;
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
        async clickCate(id,name){
            var queryParams={};
            queryParams.page=1;
            queryParams.id=id;
            const {data:res}=await this.$http.get('/admin/artical/cateArtical',{params:queryParams});
            this.contents=res.contents;
            this.total=res.total;
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
        /* background-color: #3c6382; */
        z-index: 99;
    }
    .titlePic1{
        background-image: url(../../public/img/bg22.jpg) !important;
        background-size: 4000px auto !important;
        background-position: 0 0;
        z-index: 99;
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
    }
    .center{
        width: 800px;
        margin: 0 auto;
    }
    .el-header,.el-main{
        padding: 0;
        margin-top: 20px;
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
    .el-menu{
        padding: 0 15px;
        border-radius: 15px;
        box-shadow: 0px 5px 10px 0px rgba(87, 87, 87, 0.5);
    }
    .el-menu.el-menu--horizontal{
        border: none;
    }
    #log,#logout{
        margin: 13px 20px 0 0;
        float: right;
    }
    #logout{
        display: none;
        margin-bottom: 12px;
    }
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
        /* position: relative; */
        top: 0;
        width: 750px;
        height: 300px;
        background-color: #fafafa;
        margin: 20px 25px;
        border-radius: 20px;
        padding:10px 30px;
        box-sizing: border-box;
    }
    .artical:nth-child(1){
        background-color: #fff;
        top: 340px;
        z-index: 11;
        transition:all 0.5s;
    }
    .artical:nth-child(2){
        top: 320px;
        z-index: 10;
        transform: scale(0.95);
        opacity:0.9;
        transition:all 0.5s;
    }
    .artical:nth-child(3){
        top:300px;
        z-index: 9;
        transform: scale(0.9);
        opacity:0.8;
        transition:all 0.5s;
    }
    .artical:nth-child(4){
        top: 280px;
        z-index: 8;
        transform: scale(0.85);
        opacity:0.7;
        transition:all 0.5s;
    }
    .artical:nth-child(5){
        top: 260px;
        z-index: 7;
        transform: scale(0.8);
        opacity:0.6;
        transition:all 0.5s;
    }
    .artical:nth-child(6){
        top: 240px;
        z-index: 6;
        transform: scale(0.75);
        opacity:0.5;
        transition:all 0.5s;
    }
    .artical:nth-child(7){
        top: 220px;
        z-index: 5;
        transform: scale(0.7);
        opacity:0.4;
        transition:all 0.5s;
    }
    .artical:nth-child(8){
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
    /* 登录面板 */
    .loginTitle,.tips{
        position: absolute;
        top: 190px;
        left: 50%;
        transform: translateX(-50%);
    }
    .loginTitle{
        top: 40px;
        font-size: 50px;
    }
    .tips{
        display: none;
        width: 180px;
        height: 25px;
        text-align: center;
        line-height: 25px;
        border-radius: 5px;
        background-color: pink;
        color: red;
    }
    .login{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 90%;
        padding: 0 20px 0 10px;
    }
    .loginBtn{
        width: 330px;
    }
    .loginReset{
        width: 160px;
    }
    .loginRegister{
        width: 160px;
    }
    /* 注册面板 */
    .registerTitle{
        position: absolute;
        top: 40px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 50px;
    }
    .register{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 90%;
        padding: 0 20px 0 10px;
    }
    .registerBtn{
        width: 330px;
    }
    .registerReset{
        width: 160px;
    }
    .registerLogin{
        width: 160px;
    }
    /* 卡片默认样式 */
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
    .box-card-1 {
        position: fixed;
        top: 200px;
        right: 50px;
        width: 280px;
        border-radius: 15px;
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
    .box-card-3{
        position: fixed;
        top: 380px;
        left: 60px;
        width: 240px;
        border-radius: 15px;
    }
    .box-card-3 .cate{
        background-color: rgb(250, 250, 250);
        border-radius: 10px;
        box-shadow: 0px 3px 3px 0px rgba(146, 142, 142, 0.2);
        margin-bottom: 10px;
        padding: 5px 0;
        text-align: center;
    }
    .box-card-3 .cate:hover{
        background-color: #fff;
        transform: scale(1.1);
        cursor: pointer;
        box-shadow: 0px 0px 8px 4px rgba(146, 142, 142, 0.3);
    }
    .cate:nth-last-child(1){
        margin-bottom: 0;
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
    .next{
        position: absolute;
        right: 30px;
    }
</style>