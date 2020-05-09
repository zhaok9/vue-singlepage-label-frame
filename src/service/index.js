import Vue from 'vue';
import axios from 'axios';
import Qs from 'qs';
import { store } from '../store/index';
import { URL, ROOT } from '../config/index';

axios.defaults.baseURL = ROOT;

let loadHandle = {
    el: null,
    text: null,
    time: null,
    count: { all: 0, error: 0, complete: 0 },
    create: function() {

        const load = document.createElement('div');

        load.id = 'loading';
        load.className = 'loading';

        const loadtext = document.createElement('div');

        loadtext.className = 'loading-text';
        loadtext.innerHTML = `  <div>
                                    <i class="iconfont icon-Loading"></i>
                                    <span>${ localStorage.getItem('locale') == 'zh' ? '正在准备数据' : 'Data is being prepared' }</span>
                                </div>`;

        this.el = load;
        this.text = loadtext;

        document.body.appendChild(load);
        document.body.appendChild(loadtext);
    },
    show: function() {
        clearTimeout(this.time);
        this.el.style.zIndex = 999999;
        this.el.style.opacity = 1;
        this.text.classList.add('on');
        this.count.all++;
    },
    hide: function(empty) {
        this.el.style.width = '100%';

        if (empty) {
            this.count = { all: 0, error: 0, complete: 0 };
        }

        let time = setTimeout(() => {
            this.el.style.opacity = 0;
            this.el.style.zIndex = -1;
            this.text.classList.remove('on');
            clearTimeout( time );
            let stime = setTimeout(() => {
                this.el.style.width = '1%';
                clearTimeout( stime );
            }, 300);
        }, 300);
    }
};
loadHandle.create();

// 请求拦截器
axios.interceptors.request.use(
    config => {
        const token = store.state.token, api = config.url;

        if (!store.state.enableload) {
            // 加载进度条
            !loadHandle.el ? loadHandle.el = document.querySelector('#loading') : null;
            !loadHandle.mask ? loadHandle.mask = document.querySelector('.loading-mask') : null;
            loadHandle.show();
        }

        // 清理请求
        config.cancelToken = new axios.CancelToken( cancel => {
            store.commit('pushToken', { cancelToken: cancel });
        });

        if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.token = `${ token }`;
        }


        localStorage.setItem('beforetime', +new Date());

        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// 响应拦截器
axios.interceptors.response.use(
    response => {

        if (!store.state.enableload) {

            const count = loadHandle.count;

            // 加载进度条
            count.complete++;

            if (count.complete + count.error == count.all) {

                loadHandle.time = setTimeout(() => loadHandle.hide(true), 500);

            } else {
                loadHandle.el.style.width = count.complete > 9 ? 9 : count.complete / 100 * 1000 + '%';
            }
        }

        return response;

    }, err => {
        let count = loadHandle.count;

        err.message != 'cancelRequest' ? count.error++ : count.complete++;

        count.error == 1 ? (
            Vue.prototype.$message({
                type: 'warning',
                message: '服务器错误, 请联系管理员'
            }),
            loadHandle.hide(false)
        ) : null;

        if( err.message == 'cancelRequest' ){
            loadHandle.hide(false)
        }

        return Promise.reject(err);
    }
);

const service = {
    defaults: axios.defaults,

    sync(promise) {
        return Promise.all(promise);
    },

    post(url, params) {
        return axios.post(url, Qs.stringify(params));
    },

    //json传递
    postJSON(url, params) {
        return axios.post(url, params);
    },

    get(url, params) {
        return axios.get(url + (params ? `?${ params }` : ''));
    },

    delete(url, params) {
        return axios.delete(url, params);
    },

    put(url, params) {
        return axios.put(url, params);
    },

    //文件下载
    downloadFile(url, params) {
        return axios.post(url, Qs.stringify(params), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            'responseType': 'blob'
        })
    },

    //文件上传
    uploadFile(url, params) {
        return axios.post(url, params, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        })
    },
};

Vue.prototype.http = service;