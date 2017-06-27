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
var AdminRouters = require("./admin/apis/admin.js")

function customRouters(server,auth){
    // server.get('/.*/',restify.serveStatic({  //  'localhost:8080/admin.html'
    //     directory: './pages',
    //     default: 'admin.html'
    // }));
    server.get('/login', function(req, res){
        const parmas = req.params||{};
        const username = parmas.username
        if(!username) res.send(403,{a:2});
        else sql.connect(function(err, client, done) {
            if(err) {
                return console.error('数据库连接出错', err);
            }
            //连接成功，从models表中取得model，然后生成路由
            const queryStr = `SELECT token from userinfo where username = '${username}'`

            client.query(queryStr,[], function(err, result) {
                done();// 释放连接（将其返回给连接池）
                if(err) {
                    return console.error('查询出错', err);
                }
                //command, rowCount, oid , rows
                console.log("@1:"+result.rows[0])
                res.send({token:result.rows[0]});
            });
            //自定义路由
//    customRouters(server)
        });
    });

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
    customRouters(server)
    AdminRouters(server,sql)
});

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});