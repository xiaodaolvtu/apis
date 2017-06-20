/**
 * Created by qiangli on 2017/6/16.
 */
// get<get>:
// /test
// /test/{id}     <filter>
// /test/{id}/exists   <filter>
// set<post>:
// /test  data:{item}

////不是所有浏览器都支持delete,put请求，所以用post代替
// delete<post>:
// /test/{id}/delete
function checkAuth(token){
    console.log("checkAuth")
    return token == 'aaab'
}

function send(req, res, next, auth) {
    console.log('send:'+auth+' : '+req.params.access_token +': ' checkAuth(req.params.access_token) )
    if(auth && req.params.access_token && checkAuth(req.params.access_token)) {
        console.log("认证成功")
        res.send('hello ' + req.params.id);
    }
    else  res.send(203);
    return next();
}

function createApis(modelName, permission){
    let token = '';
    if(permission) accesstoken = getToken();

}


function createModel(server, modelName, auth, model){
    const root = '/'+modelName.trim();
    console.log('createModel:'+auth)
    const handleIt = (req, res, next)=>send(req, res, next, auth)
    //create api (modelName as the table)
    server.get(root, handleIt);  //select * from table
    server.get(root+'/:id', handleIt);//select id from table
    server.post(root, function create(req, res, next) {//select * from table where filter or do something else
        const params = res.params;
        res.send(201, Math.random().toString(36).substr(3, 8));
        return next();
    });
    server.post(root+'/:id',function create(req, res, next) { //select id from table where filter
        const params = res.params;
        const filter = params.filter;
        res.send(201, Math.random().toString(36).substr(3, 8));
        return next();
    });
    //create table
    
    //create filter

}


function createRouters(server, err, client, done){
    client.query('SELECT * from models',[], function(err, result) {
        done();// 释放连接（将其返回给连接池）
        if(err) {
            return console.error('查询出错', err);
        }
        //command, rowCount, oid , rows
        console.log(JSON.stringify(result))
        result.rows.forEach((row,i)=>createModel(server, row.model, row.auth, null))
        console.log(result.rows[0].model); //output: Hello World
    });
}

module.exports = { createRouters }

