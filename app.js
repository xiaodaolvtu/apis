/**
 * Created by qiangli on 2017/6/16.
 */
// var Router = require('restify-router').Router;  //静态文件路由支持
// var routerInstance = new  Router();
var restify = require('restify');
var restifyOAuth2 = require("restify-oauth2");
var hooks = require("./hooks");
var sql = require("./sql.js"); // 数据库连接池
var { createRouters } = require("./model.js");
function customRouters(server,auth){
    server.get('/.*/',restify.serveStatic({  //  'localhost:8080/admin.html'
        directory: './pages',
        default: 'admin.html'
    }));
}
const server = restify.createServer({
    name: 'apiserver',
    version: '1.0.0'
});
server.use(restify.authorizationParser());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
//server.use(restify.plugins.bodyParser());
server.use(restify.plugins.bodyParser({ mapParams: false  }));
//restifyOAuth2.cc(server, options);
// or
restifyOAuth2.ropc(server, { tokenEndpoint: '/token', hooks: hooks , tokenExpirationTime: 3600});

//从数据库中，取得filter json 和 model。
sql.connect(function(err, client, done) {
    if(err) {
        return console.error('数据库连接出错', err);
    }
    //连接成功，从models表中取得model，然后生成路由
    createRouters(server, err, client, done)
    //自定义路由
//    customRouters(server)
});
//
server.get('/', function (req, res) {
    var response = {
        _links: {
            self: { href: RESOURCES.INITIAL },
            "http://www.baidu.com": { href:'' }
        }
    };

    if (req.username) {
        response._links["http://rel.example.com/secret"] = { href: RESOURCES.SECRET };
    } else {
        response._links["oauth2-token"] = {
            href: RESOURCES.TOKEN,
            "grant-types": "password",
            "token-types": "bearer"
        };
    }

    res.contentType = "application/hal+json";
    res.send(response);
});

server.get('/login', function(req, res){
    const parmas = req.params||{};
    const username = parmas.username
    console.log(JSON.stringify(username))
    if(!username) res.send(403,{a:2});
    else sql.connect(function(err, client, done) {
        if(err) {

            console.log("@2:")
            return console.error('数据库连接出错', err);
        }
        //连接成功，从models表中取得model，然后生成路由
        client.query('SELECT token from user where username = '+ username,[], function(err, result) {
            done();// 释放连接（将其返回给连接池）
            if(err) {
                return console.error('查询出错', err);
            }
            //command, rowCount, oid , rows
            console.log("@1:"+result.rows[0])
            res.send(200,{a:1});
        });
        //自定义路由
//    customRouters(server)
    });
});
server.listen(9999, function () {
    console.log('%s listening at %s', server.name, server.url);
});