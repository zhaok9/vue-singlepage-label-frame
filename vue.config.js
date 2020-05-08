const   path = require("path"),
        resolve = dir => path.join(__dirname, dir),
        IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV),
        TerserPlugin = require('terser-webpack-plugin'),
        CompressionWebpackPlugin = require("compression-webpack-plugin"),
        zopfli = require("@gfx/zopfli"),
        BrotliPlugin = require("brotli-webpack-plugin"),
        productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = {
    publicPath: IS_PROD ? process.env.VUE_APP_PUBLIC_PATH : "./",
    outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
    assetsDir: "static", // 相对于outputDir的静态资源(js、css、img、fonts)目录
    lintOnSave: false,
    runtimeCompiler: true,
    productionSourceMap: !IS_PROD,
    parallel: require("os").cpus().length > 1,
    pwa: {},

    configureWebpack: config => {
        const plugins = [];

        // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
        config.externals = {
            vue: "Vue",
            "element-ui": "ELEMENT",
            "vue-router": "VueRouter",
            vuex: "Vuex",
            axios: "axios"
        };

        if (IS_PROD) {

            // 去掉 console.log
            plugins.push(
                new TerserPlugin({
                    terserOptions: {
                        ecma: undefined,
                        warnings: false,
                        parse: {},
                        compress: {
                            drop_console: true,
                            drop_debugger: false,
                            pure_funcs: ['console.log'] // 移除console
                        }
                    }
                })
            );

            // 利用 splitChunks 单独打包第三方模块
            config.optimization = {
                splitChunks: {
                    cacheGroups: {
                        common: {
                            name: "chunk-common",
                            chunks: "initial",
                            minChunks: 2,
                            maxInitialRequests: 5,
                            minSize: 0,
                            priority: 1,
                            reuseExistingChunk: true,
                            enforce: true
                        },
                        vendors: {
                            name: "chunk-vendors",
                            test: /[\\/]node_modules[\\/]/,
                            chunks: "initial",
                            priority: 2,
                            reuseExistingChunk: true,
                            enforce: true
                        },
                        elementUI: {
                            name: "chunk-elementui",
                            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
                            chunks: "all",
                            priority: 3,
                            reuseExistingChunk: true,
                            enforce: true
                        },
                        echarts: {
                            name: "chunk-echarts",
                            test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
                            chunks: "all",
                            priority: 4,
                            reuseExistingChunk: true,
                            enforce: true
                        }
                    }
                }
            };

            // 开启 Zopfli 压缩
            plugins.push(
                new CompressionWebpackPlugin({
                    algorithm(input, compressionOptions, callback) {
                        return zopfli.gzip(input, compressionOptions, callback);
                    },
                    compressionOptions: {
                        numiterations: 15
                    },
                    minRatio: 0.99,
                    test: productionGzipExtensions
                })
            );

            plugins.push(
                new BrotliPlugin({
                    test: productionGzipExtensions,
                    minRatio: 0.99
                })
            );
        }

        config.plugins = [...config.plugins, ...plugins];
    },

    chainWebpack: config => {
        // 添加别名
        config.resolve.alias
            .set("vue$", "vue/dist/vue.esm.js")
            .set("@", resolve("src"))
            .set("@assets", resolve("src/assets"))
            .set("@scss", resolve("src/assets/scss"))
            .set("@components", resolve("src/components"))
            .set("@plugins", resolve("src/plugins"))
            .set("@views", resolve("src/views"))
            .set("@router", resolve("src/router"))
            .set("@store", resolve("src/store"))
            .set("@layouts", resolve("src/layouts"))
            .set("@static", resolve("src/static"));

        // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
        const cdn = {
            // 访问https://unpkg.com/element-ui/lib/theme-chalk/index.css获取最新版本
            css: [
                "//unpkg.com/element-ui@2.13.1/lib/theme-chalk/index.css"
            ],
            js: [
                !IS_PROD ? "https://unpkg.com/vue@2.6.11/dist/vue.js" :
                "//unpkg.com/vue@2.6.11/dist/vue.min.js", // 访问https://unpkg.com/vue/dist/vue.min.js获取最新版本
                "//unpkg.com/vue-router@3.1.6/dist/vue-router.min.js",
                "//unpkg.com/vuex@3.2.0/dist/vuex.min.js",
                "//unpkg.com/axios@0.19.2/dist/axios.min.js",
                "//unpkg.com/element-ui@2.13.1/lib/index.js"
            ]
        };

        // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
        config.plugin("html").tap(args => {
            // html中添加cdn
            args[0].cdn = cdn;
            return args;
        });

        if (IS_PROD) {
            config.optimization.delete("splitChunks");
        }

        return config;
    },

    devServer: {
        // overlay: { // 让浏览器 overlay 同时显示警告和错误
        //   warnings: true,
        //   errors: true
        // },
        // open: false, // 是否打开浏览器
        // host: "localhost",
        // port: "8080", // 代理断就
        // https: false,
        // hotOnly: false, // 热更新

        port: "8081",
        proxy: {
            "/api": {
                target: "https://www.easy-mock.com/mock/5bc75b55dc36971c160cad1b/sheets", // 目标代理接口地址
                secure: false,
                changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
                // ws: true, // 是否启用websockets
                pathRewrite: {
                    "^/api": ""
                }
            }
        }
    }
}