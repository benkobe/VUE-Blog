var mongoose = require('mongoose');
var contentsSchema = require('../schemas/contents.js');

//通过mongoose.model()方法创建一个叫Content的模型类(以后对分类表的增删改查操作就是操作模型类的)
module.exports = mongoose.model('Content', contentsSchema);