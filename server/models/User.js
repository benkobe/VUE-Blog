var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');
//通过mongoose.model()方法创建一个叫User的模型类(以后对用户表的增删改查操作就是操作模型类的)
module.exports = mongoose.model('User', usersSchema);