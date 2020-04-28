// 接口地址
let API = {
    // 本地环境
    'localhost:8081': 'http://182.92.100.35:18083/iotcoldchainware',
},
ROOT, URL = API[ location.host ];

//由于封装的axios请求中，会将ROOT打包进去，为了方便之后不再更改，判断了当前环境，而生成的不同的ROOT
if (process.env.NODE_ENV === "development") {
    //开发环境下的代理地址，解决本地跨域跨域
    ROOT = "/api";
} else {
    //生产环境下的地址
    ROOT = URL;
}
exports.URL = URL; //代理指向地址
exports.ROOT = ROOT;

