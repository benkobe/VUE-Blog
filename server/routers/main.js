var express = require('express');
var User = require('../models/User');
var Content = require('../models/Content');
var bodyParser = require('body-parser');
//加载jsonwebtoken模块
var jwt = require('jsonwebtoken');

var router = express.Router();

//设定一个变量，用于接收服务器端在注册用户时返回给前端的信息
var serverData;
router.use(function(req, res, next) {
    serverData = {
        code: 0,
        message: ''
    }
    next();
});

//注册
router.post('/user/register', function(req, res) {
    // console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var rePassword = req.body.rePassword;
    //当两次输入的密码不一致时
    if (password !== rePassword) {
        serverData.code = 3;
        serverData.message = '两次输入的密码不一致';
        res.json(serverData);
        return;
    }
    //通过表单的验证之后，接着就要进行数据库的验证了
    User.findOne({
        username: username
    }).then(function(isExistUsername) {
        // console.log(isExistUsername);//如果输入的用户名没被注册，输入null
        if (isExistUsername) {
            //如果isExistUsername为true，表明该用户名已被注册
            serverData.code = 4;
            serverData.message = '该用户名已被注册';
            res.json(serverData);
            return;
        }
        //如果isExistUsername为空，即该用户名没被注册，则保存用户注册的信息到数据库中
        var user = new User({
            username: username,
            password: password
        });
        //如果用户名没被注册就保存到数据库中
        return user.save();
    }).then(function(newUser) {
        // console.log(newUser);//newUser的值就是用户成功注册的信息
        serverData.message = '注册成功';
        //注册成功之后返回前端登录用户的信息
        serverData.userInfo = {
            id: newUser._id,
            username: newUser.username
        };
        // 如果想要注册成功之后直接跳转登录，就保留下面的设置cookie的语句；如果想注册成功之后还需要手动输入用户名和密码才能登录的话，就把下面的设置cookie的语句解除注释，把设置cookie的语句写在登录成功后面
        // req.cookies.set('userCookies', JSON.stringify({
        //     id: newUser._id,
        //     username: newUser.username
        // }));
        res.json(serverData);
    });
});

//登录
router.post('/user/login', function(req, res) {
    // console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo) {
        // console.log(userInfo);
        if (!userInfo) {
            serverData.code = 1;
            serverData.message = '用户名或密码错误';
            res.json(serverData);
            return;
        }
        //生成token
        var token = jwt.sign({
            username: username //加密的对象
        }, "abc");
        // console.log(token);
        serverData.message = '登录成功';
        //登录成功之后返回前端登录用户的信息
        serverData.userInfo = {
            id: userInfo._id,
            username: userInfo.username,
            isAdmin: userInfo.isAdmin,
            token: token
        };
        req.userInfo = serverData.userInfo;
        // console.log(req.userInfo);
        res.json(serverData);
    });
});

//文章详情页
router.get('/logined/detail', function(req, res) {
    // console.log(req.query);
    var contentId = req.query.contentId;
    Content.findOne({
        _id: contentId
    }).populate(['categoryname', 'user']).then(function(content) {
        serverData.content = content;
        // console.log(content);
        //阅读量的增加
        content.views++;
        content.save();
        res.json(serverData);
    });
});

// 发表文章评论
router.post('/logined/detail/comment', function(req, res) {
    //contentID的值都是通过ajax的post方式提交过来的
    var contentID = req.body.params.contentId;
    // console.log(req.body.params.commentContent);
    var postData = {
        CommentId: Math.random().toString(36).slice(-8),
        contentCate: req.body.params.contentCate,
        contentTitle: req.body.params.contentTitle,
        username: req.body.params.username,
        postTime: new Date(),
        //content的值都是通过ajax的post方式提交过来的
        content: req.body.params.commentContent,
        contentId: contentID
    };
    //查询这篇文章的信息，并将用户的评论相关的信息保存在文章中
    Content.findOne({
        _id: contentID
    }).then(function(content) {
        content.comments.push(postData);
        return content.save();
    }).then(function(newContent) {
        // console.log(newContent);
        //newContent就是这篇文章的最新信息(即包含最新的评论相关的信息)
        serverData = newContent;
        //res.json()方法的作用就是服务器将数据返回给前端
        res.json(serverData);
    });
});

module.exports = router;