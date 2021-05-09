var express = require('express');
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');
var jwt = require('jsonwebtoken');

var router = express.Router();

//设定一个变量，用于接收服务器端在注册用户时返回给前端的信息
var serverData;
router.use(function(req, res, next) {
    serverData = {};
    next();
});

//用户列表
router.get('/users', function(req, res) {
    // console.log(req);
    // 验证请求是否有token
    var token = req.headers.authorization;
    // console.log(token);
    jwt.verify(token, "abc", (err, decode) => {
        //第一个参数传递token
        //第二个参数解密规则
        //回调函数
        if (err) {
            serverData.message = "获取数据失败";
            res.json(serverData);
        } else {
            // console.log(req.query);//输入的是axios请求传递过来的请求参数对象{page:1}
            //从数据库读取所有已注册的用户的用户信息
            // 分页显示已注册用户的用户信息数据
            // limit(Number):限制获取数据的条数(在这里就是表示每页显示的条数)
            // skip(Number):忽略数据的条数，例如skip(2)表示忽略掉前面2条数据从第3条数据开始获取
            //假设每页显示5条用户信息的数据
            // 第1页：1-5    skip:0   -> (当前页-1)*limit -> (1-1)*5=0
            // 第2页：6-10   skip:5   -> (当前页-1)*limit -> (2-1)*5=5
            // 第3页：11-15  skip:10  -> (当前页-1)*limit -> (3-1)*5=10

            // 默认当前页为第1页，每页限制显示10条数据
            //page：当前页码
            var page = Number(req.query.page || 1);
            //limit：每页显示的数据条数
            var limit = 8;
            //pages：总页数
            var pages = 0;

            // User.count()方法：查询User这个数据模型中总共有多少条数据
            User.count().then(function(count) {
                // console.log(count); //输出已注册用户的数目
                //计算总页数(向上取整)
                pages = Math.ceil(count / limit);
                // console.log(pages);
                //处理page的取值范围
                //page的值不能超过pages(意思就是当page大于pages时page就取pages的值)
                page = Math.min(page, pages);
                //page的值不能小于1(意思就是当page的值小于1时page就取1)
                page = Math.max(page, 1);
                //skip：跳转到某个页码时数据库需要忽略查询的数据条数
                var skip = (page - 1) * limit;
                //返回给前端注册用户的总条数
                serverData.total = count;
                //User.sort():排序方法；User.sort({_id:-1}):通过_id进行排序，通过_id排序可以取两个值 1和-1，1表示升序，-1表示降序；为什么可以通过_id进行排序呢？因为数据库生成的_id中都含有一个时间戳，越新生成的_id的时间戳越大
                return User.find().sort({ _id: -1 }).limit(limit).skip(skip);
            }).then(function(userList) {
                // console.log(userList);
                serverData.userList = userList;
                res.json(serverData);
            });
        }
    });
});

// 删除用户
router.get('/user/delete', function(req, res) {
    // 验证请求是否有token
    var token = req.headers.authorization;
    // console.log(token);
    jwt.verify(token, "abc", (err, decode) => {
        //第一个参数传递token
        //第二个参数解密规则
        //回调函数
        if (err) {
            serverData.message = "获取数据失败";
            res.json(serverData);
        } else {
            // console.log(req.query);
            var id = req.query.id;
            User.remove({ _id: id }).then(function() {
                serverData.message = '删除成功';
                res.json(serverData);
            });
        }
    });
});

// 搜索用户
router.get('/user/search', function(req, res) {
    // 验证请求是否有token
    var token = req.headers.authorization;
    // console.log(token);
    jwt.verify(token, "abc", (err, decode) => {
        //第一个参数传递token
        //第二个参数解密规则
        //回调函数
        if (err) {
            serverData.message = "获取数据失败";
            res.json(serverData);
        } else {
            var page = Number(req.query.page || 1);
            //limit：每页显示的数据条数
            var limit = 8;
            //pages：总页数
            var pages = 0;

            // console.log(req.query);
            var searchQuery = req.query.searchQuery;
            // User.count()方法：查询User这个数据模型中总共有多少条数据
            User.find({ username: eval("/" + searchQuery + "/i") }).count().then(function(count) {
                // console.log(count); //输出已注册用户的数目
                //计算总页数(向上取整)
                pages = Math.ceil(count / limit);
                // console.log(pages);
                //处理page的取值范围
                //page的值不能超过pages(意思就是当page大于pages时page就取pages的值)
                page = Math.min(page, pages);
                //page的值不能小于1(意思就是当page的值小于1时page就取1)
                page = Math.max(page, 1);
                //skip：跳转到某个页码时数据库需要忽略查询的数据条数
                var skip = (page - 1) * limit;
                //返回给前端注册用户的总条数
                serverData.total = count;
                return User.find({ username: eval("/" + searchQuery + "/i") }).limit(limit).skip(skip);
            }).then(function(allUsers) {
                // console.log(allUsers);
                serverData.allUsers = allUsers;
                serverData.code = 100;
                res.json(serverData);
            });
        }
    });
});

//分类列表(分段返回分类数据)
router.get('/category', function(req, res) {
    // 验证请求是否有token
    var token = req.headers.authorization;
    // console.log(token);
    jwt.verify(token, "abc", (err, decode) => {
        //第一个参数传递token
        //第二个参数解密规则
        //回调函数
        if (err) {
            serverData.message = "获取数据失败";
            res.json(serverData);
        } else {
            // 默认当前页为第1页，每页限制显示10条数据
            //page：当前页码
            var page = Number(req.query.page || 1);
            //limit：每页显示的数据条数
            var limit = 8;
            //pages：总页数
            var pages = 0;

            // Category.count()方法：查询Category这个数据模型中总共有多少条数据
            Category.count().then(function(count) {
                // console.log(count); //输出分类的数目
                //计算总页数(向上取整)
                pages = Math.ceil(count / limit);
                //处理page的取值范围
                //page的值不能超过pages(意思就是当page大于pages时page就取pages的值)
                page = Math.min(page, pages);
                //page的值不能小于1(意思就是当page的值小于1时page就取1)
                page = Math.max(page, 1);
                //skip：跳转到某个页码时数据库需要忽略查询的数据条数
                var skip = (page - 1) * limit;
                //返回给前端分类的的总条数
                serverData.total = count;
                return Category.find().sort({ _id: -1 }).limit(limit).skip(skip);
            }).then(function(categoryList) {
                // console.log(categoryList);
                serverData.categoryList = categoryList;
                res.json(serverData);
            });
        }
    });
});

//分类列表(全部返回，用于添加文章时选择文章所属分类)
router.get('/allCategory', function(req, res) {
    Category.find().then(function(allCategory) {
        // console.log(allCategory);
        serverData.allCategory = allCategory;
        res.json(serverData);
        // console.log(serverData);
    });
});

//添加分类
router.post('/category/addCategory', function(req, res) {
    // console.log(req.body);//输出：{categoryname:xxxx}
    var categoryname = req.body.categoryname;
    Category.findOne({
        categoryname: categoryname
    }).then(function(isExitsCate) {
        if (isExitsCate) {
            //如果isExitsCate为true,表示该分类名称在数据库中已经存在
            serverData.code = 1;
            serverData.message = '你添加的分类已存在';
            return Promise.reject();
        } else {
            return new Category({
                categoryname: categoryname
            }).save();
        }
    }).then(function(newCategory) {
        serverData.message = '添加分类成功';
        res.json(serverData);
    });
});

//修改分类
router.get('/category/edit', function(req, res) {
    // 验证请求是否有token
    var token = req.headers.authorization;
    // console.log(token);
    jwt.verify(token, "abc", (err, decode) => {
        //第一个参数传递token
        //第二个参数解密规则
        //回调函数
        if (err) {
            serverData.message = "获取数据失败";
            res.json(serverData);
        } else {
            // console.log(req.query.id);
            var id = req.query.id;
            Category.findOne({ _id: id }).then(function(editCategoryInfo) {
                serverData.editCategoryInfo = editCategoryInfo;
                res.json(serverData);
            });
        }
    });
});

//保存修改的分类
router.post('/category/edit', function(req, res) {
    // 验证请求是否有token
    var token = req.headers.authorization;
    // console.log(token);
    jwt.verify(token, "abc", (err, decode) => {
        //第一个参数传递token
        //第二个参数解密规则
        //回调函数
        if (err) {
            serverData.message = "获取数据失败";
            res.json(serverData);
        } else {
            // console.log(req.body); //输出：{ _id: '6030be493ae47215881516b9', categoryname: '修改后的分类的名称', __v: 0 }
            var id = req.body._id;
            var newCategoryname = req.body.categoryname;
            // console.log(id, newCategoryname);
            Category.findOne({ _id: id }).then(function(category) {
                //当用户没有修改分类的名称就提交时
                if (category.categoryname === newCategoryname) {
                    serverData.code = 1;
                    res.json(serverData);
                    return Promise.reject();
                } else {
                    //当用户修改了分类的名称时，还要判断修改了之后的分类名称在数据库是否有同名
                    return Category.findOne({ _id: { $ne: id }, categoryname: newCategoryname });
                }
            }).then(function(isSameCate) {
                if (isSameCate) {
                    serverData.code = 2;
                    res.json(serverData);
                } else {
                    return Category.updateOne({
                        _id: id
                    }, {
                        categoryname: newCategoryname
                    });
                }
            }).then(function() {
                serverData.code = 0;
                serverData.message = '更新成功';
                res.json(serverData);
            });
        }
    });
});

// 搜索分类
router.get('/category/search', function(req, res) {
    // 验证请求是否有token
    var token = req.headers.authorization;
    // console.log(token);
    jwt.verify(token, "abc", (err, decode) => {
        //第一个参数传递token
        //第二个参数解密规则
        //回调函数
        if (err) {
            serverData.message = "获取数据失败";
            res.json(serverData);
        } else {
            var page = Number(req.query.page || 1);
            //limit：每页显示的数据条数
            var limit = 8;
            //pages：总页数
            var pages = 0;

            // console.log(req.query);
            var searchQuery = req.query.searchQuery;
            // User.count()方法：查询User这个数据模型中总共有多少条数据
            Category.find({ categoryname: eval("/" + searchQuery + "/i") }).count().then(function(count) {
                // console.log(count); //输出已注册用户的数目
                //计算总页数(向上取整)
                pages = Math.ceil(count / limit);
                // console.log(pages);
                //处理page的取值范围
                //page的值不能超过pages(意思就是当page大于pages时page就取pages的值)
                page = Math.min(page, pages);
                //page的值不能小于1(意思就是当page的值小于1时page就取1)
                page = Math.max(page, 1);
                //skip：跳转到某个页码时数据库需要忽略查询的数据条数
                var skip = (page - 1) * limit;
                //返回给前端注册用户的总条数
                serverData.total = count;
                return Category.find({ categoryname: eval("/" + searchQuery + "/i") }).limit(limit).skip(skip);
            }).then(function(allCategory) {
                // console.log(allUsers);
                serverData.allCategory = allCategory;
                serverData.code = 100;
                res.json(serverData);
            });
        }
    });
});

//删除分类
router.get('/category/delete', function(req, res) {
    // 验证请求是否有token
    var token = req.headers.authorization;
    // console.log(token);
    jwt.verify(token, "abc", (err, decode) => {
        //第一个参数传递token
        //第二个参数解密规则
        //回调函数
        if (err) {
            serverData.message = "获取数据失败";
            res.json(serverData);
        } else {
            // console.log(req.query);
            var id = req.query.id;
            Content.find().then(function(result) {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].categoryname == id) {
                        serverData.code = 0;
                        serverData.msg = '该分类下还有文章没被删除';
                        res.json(serverData);
                        return Promise.reject();
                    }
                }
                return Category.remove({ _id: id });
            }).then(function() {
                serverData.code = 1;
                serverData.message = '删除成功';
                res.json(serverData);
            });
            // Content.remove({});
        }
    });
});

// 文章列表
router.get('/artical', function(req, res) {
    // console.log(req.query);//输入的是axios请求传递过来的请求参数对象{page:1}
    //从数据库读取所有已注册的用户的用户信息
    // 分页显示已注册用户的用户信息数据
    // limit(Number):限制获取数据的条数(在这里就是表示每页显示的条数)
    // skip(Number):忽略数据的条数，例如skip(2)表示忽略掉前面2条数据从第3条数据开始获取
    //假设每页显示5条用户信息的数据
    // 第1页：1-5    skip:0   -> (当前页-1)*limit -> (1-1)*5=0
    // 第2页：6-10   skip:5   -> (当前页-1)*limit -> (2-1)*5=5
    // 第3页：11-15  skip:10  -> (当前页-1)*limit -> (3-1)*5=10

    // 默认当前页为第1页，每页限制显示10条数据
    //page：当前页码
    var page = Number(req.query.page || 1);
    //limit：每页显示的数据条数
    var limit = 8;
    //pages：总页数
    var pages = 0;

    // Content.count()方法：查询Content这个数据模型中总共有多少条数据
    Content.find().count().then(function(count) {
        // console.log(count); //输出已添加的文章的数目
        //计算总页数(向上取整)
        pages = Math.ceil(count / limit);
        //处理page的取值范围
        //page的值不能超过pages(意思就是当page大于pages时page就取pages的值)
        page = Math.min(page, pages);
        //page的值不能小于1(意思就是当page的值小于1时page就取1)
        page = Math.max(page, 1);
        //skip：跳转到某个页码时数据库需要忽略查询的数据条数
        var skip = (page - 1) * limit;
        //返回给前端文章的总条数
        serverData.total = count;

        //Content.sort():排序方法；Content.sort({_id:-1}):通过_id进行排序，通过_id排序可以取两个值 1和-1，1表示升序，-1表示降序；为什么可以通过_id进行排序呢？因为数据库生成的_id中都含有一个时间戳，越新生成的_id的时间戳越大
        //populate('categoryname')：categoryname的来源是schemas/contents.js中的categoryname字段(user同理)；调用populate()这个方法的意思就是将categoryname这个字段关联的Category模型对应的id的所有信息查询扩展出来，可以通过下面的console.log(contents)查看
        Content.find().sort({ _id: -1 }).limit(limit).skip(skip).populate(['categoryname', 'user']).then(function(contents) {
            // console.log(contents);
            serverData.contents = contents;
            res.json(serverData);
        });
    });
});

// 根据分类返回对应文章
router.get('/artical/cateArtical', function(req, res) {
    var page = Number(req.query.page || 1);
    var id = req.query.id;
    var limit = 8;
    var pages = 0;
    Content.find({ categoryname: id }).count().then(function(count) {
        console.log(count);
        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        serverData.total = count;
        Content.find({ categoryname: id }).sort({ _id: -1 }).limit(limit).skip(skip).populate(['categoryname', 'user']).then(function(contents) {
            console.log(contents);
            serverData.contents = contents;
            res.json(serverData);
        });
    });
});

// 搜索文章
router.get('/artical/search', function(req, res) {
    // 验证请求是否有token
    var token = req.headers.authorization;
    // console.log(token);
    jwt.verify(token, "abc", (err, decode) => {
        //第一个参数传递token
        //第二个参数解密规则
        //回调函数
        if (err) {
            serverData.message = "获取数据失败";
            res.json(serverData);
        } else {
            var page = Number(req.query.page || 1);
            //limit：每页显示的数据条数
            var limit = 8;
            //pages：总页数
            var pages = 0;

            // console.log(req.query);
            var searchQuery = req.query.searchQuery;
            // User.count()方法：查询User这个数据模型中总共有多少条数据
            Content.find({ title: eval("/" + searchQuery + "/i") }).count().then(function(count) {
                // console.log(count); //输出已注册用户的数目
                //计算总页数(向上取整)
                pages = Math.ceil(count / limit);
                // console.log(pages);
                //处理page的取值范围
                //page的值不能超过pages(意思就是当page大于pages时page就取pages的值)
                page = Math.min(page, pages);
                //page的值不能小于1(意思就是当page的值小于1时page就取1)
                page = Math.max(page, 1);
                //skip：跳转到某个页码时数据库需要忽略查询的数据条数
                var skip = (page - 1) * limit;
                //返回给前端注册用户的总条数
                serverData.total = count;
                return Content.find({ title: eval("/" + searchQuery + "/i") }).limit(limit).skip(skip);
            }).then(function(contents) {
                // console.log(allUsers);
                serverData.contents = contents;
                serverData.code = 100;
                res.json(serverData);
            });
        }
    });
});

// 添加文章
router.post('/artical/addArtical', function(req, res) {
    // 验证请求是否有token
    var token = req.headers.authorization;
    // console.log(token);
    jwt.verify(token, "abc", (err, decode) => {
        //第一个参数传递token
        //第二个参数解密规则
        //回调函数
        if (err) {
            serverData.message = "获取数据失败";
            res.json(serverData);
        } else {
            // req.body输出的是前端传过来的newArticalInfo参数对象
            // console.log(req.body);
            // console.log(req.userInfo);
            var articalCategory = req.body.articalCategory;
            var articalname = req.body.articalname;
            var articalDescription = req.body.articalDescription;
            var articalContent = req.body.articalContent;
            var articalUsername = req.body.articalUsername;
            Content.findOne({
                title: articalname
            }).then(function(isExits) {
                if (isExits) {
                    //如果isExitsCate为true,表示该分类名称在数据库中已经存在
                    serverData.code = 1;
                    serverData.message = '你添加的文章标题已存在';
                    return Promise.reject();
                } else {
                    // console.log('111')
                    return new Content({
                        addTime: new Date(),
                        user: articalUsername,
                        title: articalname,
                        categoryname: articalCategory,
                        description: articalDescription,
                        content: articalContent
                    }).save();
                }
            }).then(function(newArtical) {
                serverData.code = 0;
                res.json(serverData);
            });
        }
    });
});

//删除文章
router.get('/artical/delete', function(req, res) {
    // 验证请求是否有token
    var token = req.headers.authorization;
    // console.log(token);
    jwt.verify(token, "abc", (err, decode) => {
        //第一个参数传递token
        //第二个参数解密规则
        //回调函数
        if (err) {
            serverData.message = "获取数据失败";
            res.json(serverData);
        } else {
            // console.log(req.query);
            var id = req.query.id;
            Content.remove({ _id: id }).then(function() {
                serverData.message = '删除成功';
                res.json(serverData);
            });
        }
    });
});

//修改文章
router.get('/artical/edit', function(req, res) {
    // 验证请求是否有token
    var token = req.headers.authorization;
    // console.log(token);
    jwt.verify(token, "abc", (err, decode) => {
        //第一个参数传递token
        //第二个参数解密规则
        //回调函数
        if (err) {
            serverData.message = "获取数据失败";
            res.json(serverData);
        } else {
            // console.log(req.query.id);
            var id = req.query.id;
            Content.findOne({ _id: id }).then(function(editContentInfo) {
                serverData.editContentInfo = editContentInfo;
                res.json(serverData);
            });
        }
    });
});

//保存修改的文章
router.post('/artical/saveEdit', function(req, res) {
    // 验证请求是否有token
    var token = req.headers.authorization;
    // console.log(token);
    jwt.verify(token, "abc", (err, decode) => {
        //第一个参数传递token
        //第二个参数解密规则
        //回调函数
        if (err) {
            serverData.message = "获取数据失败";
            res.json(serverData);
        } else {
            // console.log(req.body); //输出：{ _id: '6030be493ae47215881516b9', categoryname: '修改后的分类的名称', __v: 0 }
            var id = req.body._id;
            var newTitle = req.body.title;
            var newDescription = req.body.description;
            var newContent = req.body.content;
            var newCategoryname = req.body.categoryname;
            // console.log('111', newTitle, newDescription, newContent, newCategoryname);
            Content.findOne({ _id: id }).then(function(content) {
                //当用户没有修改文章标题就提交时
                if (content.title === newTitle && content.description === newDescription && content.content === newContent && content.categoryname === newCategoryname) {
                    serverData.code = 1;
                    res.json(serverData);
                    return Promise.reject();
                } else if (content.title === newTitle && (content.description !== newDescription || content.content !== newContent || content.categoryname !== newCategoryname)) {
                    Content.updateOne({
                        _id: id
                    }, {
                        title: newTitle,
                        description: newDescription,
                        content: newContent,
                        categoryname: newCategoryname
                    });
                } else {
                    //当用户修改了文章的标题时，还要判断修改了之后的文章标题在数据库是否有同名
                    return Content.findOne({ title: newTitle });
                }
            }).then(function(isSameCate) {
                console.log(isSameCate);
                if (isSameCate) {
                    serverData.code = 2;
                    res.json(serverData);
                    return Promise.reject();
                } else {
                    return Content.updateOne({
                        _id: id
                    }, {
                        title: newTitle,
                        description: newDescription,
                        content: newContent,
                        categoryname: newCategoryname
                    });
                }
            }).then(function(newContents) {
                console.log(newContents);
                serverData.code = 0;
                serverData.message = '更新成功';
                res.json(serverData);
            });
        }
    });
});

// 获取评论列表
router.get('/artical/comments', function(req, res) {
    // 默认当前页为第1页，每页限制显示10条数据
    //page：当前页码
    var page = Number(req.query.page || 1);
    //limit：每页显示的数据条数
    var limit = 8;
    //pages：总页数
    var pages = 0;

    Content.find().sort({ _id: -1 }).populate(['categoryname', 'user']).then(function(contents) {
        var comments = [];
        for (var i = 0; i < contents.length; i++) {
            comments.push(...contents[i].comments);
        }
        var count = comments.length;
        pages = Math.ceil(count / limit);
        //处理page的取值范围
        //page的值不能超过pages(意思就是当page大于pages时page就取pages的值)
        page = Math.min(page, pages);
        //page的值不能小于1(意思就是当page的值小于1时page就取1)
        page = Math.max(page, 1);
        //skip：跳转到某个页码时数据库需要忽略查询的数据条数
        var skip = (page - 1) * limit;
        allComments = comments.slice(skip, skip + limit);
        // console.log(allComments);
        serverData.allComments = allComments;
        serverData.total = count;
        res.json(serverData);
    });
});

// 搜索评论
router.get('/artical/comment/search', function(req, res) {
    // 验证请求是否有token
    var token = req.headers.authorization;
    // console.log(token);
    jwt.verify(token, "abc", (err, decode) => {
        //第一个参数传递token
        //第二个参数解密规则
        //回调函数
        if (err) {
            serverData.message = "获取数据失败";
            res.json(serverData);
        } else {
            var page = Number(req.query.page || 1);
            //limit：每页显示的数据条数
            var limit = 8;
            //pages：总页数
            var pages = 0;
            var searchQuery = req.query.searchQuery;
            var searchCommentContent = [];
            var searchComment = [];
            Content.find().sort({ _id: -1 }).populate(['categoryname', 'user']).then(function(contents) {
                var comments = [];
                for (var i = 0; i < contents.length; i++) {
                    comments.push(...contents[i].comments);
                }
                var count = comments.length;
                pages = Math.ceil(count / limit);
                //处理page的取值范围
                //page的值不能超过pages(意思就是当page大于pages时page就取pages的值)
                page = Math.min(page, pages);
                //page的值不能小于1(意思就是当page的值小于1时page就取1)
                page = Math.max(page, 1);
                //skip：跳转到某个页码时数据库需要忽略查询的数据条数
                var skip = (page - 1) * limit;
                allComments = comments.slice(skip, skip + limit);
                for (let i = 0; i < allComments.length; i++) {
                    console.log(allComments[i].content);
                    if (allComments[i].content.indexOf(searchQuery) != -1) {
                        searchCommentContent.push(allComments[i].content);
                        count = searchComment.length;
                        searchComment.push(allComments[i]);
                    }
                }
                serverData.searchComment = searchComment;
                serverData.total = count;
                res.json(serverData);
            });
        }
    });
});

// 删除评论
router.get('/artical/comments/delete', function(req, res) {
    // 验证请求是否有token
    var token = req.headers.authorization;
    // console.log(token);
    jwt.verify(token, "abc", (err, decode) => {
        //第一个参数传递token
        //第二个参数解密规则
        //回调函数
        if (err) {
            // serverData.message = "删除评论失败";
            // res.json(serverData);
            return
        } else {
            // console.log(req.query);
            var id = req.query.id;
            var contentId = req.query.contentId;
            Content.find().sort({ _id: -1 }).populate(['categoryname', 'user']).then(function(contents) {
                var comments = [];
                for (var i = 0; i < contents.length; i++) {
                    comments.push(...contents[i].comments);
                }
                // console.log(comments);
                // console.log('--------------------------------------');
                for (var j = 0; j < comments.length; j++) {
                    if (comments[j].CommentId == id) {
                        var commentDel = comments.splice(j, 1);
                        console.log(commentDel);
                        console.log('--------------------------------------');
                        console.log(comments);
                        console.log(comments.length);
                    }
                }
                var commentsNew = [];
                for (var k = 0; k < comments.length; k++) {
                    if (comments[k].contentId == contentId) {
                        commentsNew.push(comments[k]);
                    }
                }
                console.log(commentsNew);
                Content.find({ _id: contentId }).update({ comments: commentsNew }).then(function(res) { console.log(res) });
                serverData.code = 0;
                res.json(serverData);
                // var count = comments.length;
                // pages = Math.ceil(count / limit);
                // //处理page的取值范围
                // //page的值不能超过pages(意思就是当page大于pages时page就取pages的值)
                // page = Math.min(page, pages);
                // //page的值不能小于1(意思就是当page的值小于1时page就取1)
                // page = Math.max(page, 1);
                // //skip：跳转到某个页码时数据库需要忽略查询的数据条数
                // var skip = (page - 1) * limit;
                // allComments = comments.slice(skip, skip + limit);
                // // console.log(allComments);
                // serverData.allComments = allComments;
                // serverData.total = count;
                // res.json(serverData);
            });
        }
    });
});

module.exports = router;