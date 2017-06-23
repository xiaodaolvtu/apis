/**
 * Created by qiangli on 2017/6/23.
**/
module.exports = {
    entry:  __dirname + "/admin/main.js",	// __dirname是Node的全局变量，值为当前目录
    output: {
        path: __dirname + "/admin/build/",
        filename: "bundle.js"
    }
}

