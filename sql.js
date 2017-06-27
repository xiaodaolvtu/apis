var pg = require('pg');
/**
 *
 * pgconnect 参数：
 * user
 * password
 * port
 * application_name
 * fallback_application_name
 *
 * sslmode
 * sslca
 * sslkey
 * sslcert
 *
 * dbname
 * replication
 * host
 * client_encoding
 * hostaddr
 *
 *
 * **/

const config = {
    user:"xdaoo",
    database:"xdaoo",
    password:"1234",
    port:32793,
    //port:5432,
    host:'69.85.84.221',
    // 扩展属性
    max:20, // 连接池最大连接数
    idleTimeoutMillis:3000, // 连接最大空闲时间 3s
}
const sql = new pg.Pool(config);

module.exports = sql