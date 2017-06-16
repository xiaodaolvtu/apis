/**
 * Created by qiangli on 2017/6/16.
 */
var restify = require('restify');


const server = restify.createServer({
    name: 'apiserver',
    version: '1.0.0'
});
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

const hello = 'hello'
const Token = 'aaab'
function checkAuth(token){
    return token == 'aaab'
}

function send(req, res, next, auth) {

    console.log(auth+'' + req.params.access_token + checkAuth(req.params.access_token))
    if(auth && req.params.access_token && checkAuth(req.params.access_token)) {
        console.log("认证成功")
        res.send('hello ' + req.params.id);
    }
    else  res.send(203);
    return next();
}
let handleIt = (req, res, next)=>send(req, res, next, true)

server.post('/'+hello, function create(req, res, next) {
    res.send(201, Math.random().toString(36).substr(3, 8));
    return next();
});
server.get('/'+hello+'/:id', handleIt);
// server.put('/hello', send);
// server.head('/hello/:name', send);
// server.del('hello/:name', function rm(req, res, next) {
//     res.send(204);
//     return next();
// });
server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});