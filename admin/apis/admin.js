function AdminRouters(server,sql){
    //验证
    server.post('/admin', function(req, res){
        const parmas = req.params||{}
        const username = parmas.username;
        const password = parmas.password;
        if(!username)  res.send('用户名为空');

        else sql.connect(function(err, client, done) {
            if(err) {
                return console.error('数据库连接出错', err);
            }
            const queryStr = `SELECT token from ﻿admin_user where username = '${username}' and password='${password}'`

            client.query(queryStr,[], function(err, result) {
                done();// 释放连接（将其返回给连接池）
                if(err) {
                    return console.error('查询出错', err);
                }
                //command, rowCount, oid , rows
                if(!result.rows || result.rows.length == 0) res.send(-1)
                else  res.send(1);
            });
        })
    });
    //取models

    //设置models，filters，apis

}

module.exports = AdminRouters