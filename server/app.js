//后台应用(启动)入口文件

//加载express模块
var express = require('express');
//加载数据库模块
var mongoose = require('mongoose');
//加载body-parser模块(用来处理post请求方式提交过来的数据)
var bodyParser = require('body-parser');
//加载cookies模块
// var cookies = require('cookies');
// const Cookies = require('cookies');
//加载jsonwebtoken模块
var jwt = require('jsonwebtoken');

//通过express创建app应用，相当于创建web服务器
var app = express();

//配置body-parser;通过调用bodyParser.urlencoded()方法之后，会在request对象中添加一个属性--body属性，这个body属性的值就是post方式提交过来的数据(其实就是方便后端获取到前端提交过来的请求数据)
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//设置跨域请求
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild,Access-Control-Allow-Headers');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//根据不同的功能通过app.use()方法划分不同的模块(相当于加载路由)
app.use('/', require('./routers/main'));
app.use('/admin', require('./routers/admin'));


//连接数据库(连接数据库之前需要开启mongodb的服务器)
mongoose.connect('mongodb://localhost:27017/blog', function(err) {
    if (err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');
        //监听http请求
        app.listen(8080);
    }
});