var mongoose = require('mongoose');

//定义文章的表结构(表规则)
module.exports = new mongoose.Schema({
    //关联字段--文章所属分类
    'categoryname': {
        //类型为ObjectId
        type: mongoose.Schema.Types.ObjectId,
        //引用另外一个数据模型
        ref: 'Category'
    },
    'title': String,
    //关联字段--用户id
    'user': {
        //类型为ObjectId
        type: mongoose.Schema.Types.ObjectId,
        //引用另外一个模型
        ref: 'User'
    },
    //发布文章的时间
    'addTime': {
        type: Date,
        //默认值为当前系统时间
        default: new Date()
    },
    //阅读量
    'views': {
        type: Number,
        default: 0
    },
    //文章简介
    'description': {
        type: String,
        default: ''
    },
    //文章正文
    'content': {
        type: String,
        default: ''
    },
    //文章的评论
    'comments': {
        type: Array,
        default: []
    }
});