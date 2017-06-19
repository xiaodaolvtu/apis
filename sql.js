var pg = require('pg');

const config = {
    user:"xdaoo",
    database:"xdaoo",
    password:"1234",
    port:32793,

    // 扩展属性
    max:20, // 连接池最大连接数
    idleTimeoutMillis:3000, // 连接最大空闲时间 3s
}
const sql = new pg.Pool(config);

module.exports = sql