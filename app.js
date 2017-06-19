/**
 * Created by qiangli on 2017/6/16.
 */
// var Router = require('restify-router').Router;  //静态文件路由支持
// var routerInstance = new  Router();
var restify = require('restify');
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
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

//从数据库中，取得filter json 和 model。
sql.connect(function(err, client, done) {
    if(err) {
        return console.error('数据库连接出错', err);
    }
    //连接成功，从models表中取得model，然后生成路由
    createRouters(server, err, client, done)
    //自定义路由
    customRouters(server)
});
//

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});