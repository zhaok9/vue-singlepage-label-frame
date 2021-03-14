import Vue from 'vue';
import { store } from '../store';

const util = {
    deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    /**
     * [strlen 中英文字符长度]
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    strlen(str) {

        let len = 0;

        for (let i = 0; i < str.length; i++) {

            let c = str.charCodeAt(i);

            //单字节加1
            (c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f) ? len++ : len += 2;
        }

        return len;
    },

    /**
     * [copy 表格列单击复制文本]
     * @param  {[type]} el [description]
     * @return {[type]}    [description]
     */
    copy(el) {
        if (el) {
            const input = document.createElement('input');

            input.style = 'position:fixed;top:-999px;left:-999px';

            input.value = el.innerText;

            document.body.appendChild(input);

            input.select();

            document.execCommand('Copy');

            document.body.removeChild(input);

            return true;
        }

        return false;
    },

    /**
     * [格式化日期]
     * @param  {[type]} str  [description]
     * @param  {[type]} date [description]
     * @return {[type]}      [description]
     */
    formatDate(fmt, date) {
        if (typeof date !== 'string' && date) {
            let o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                S: date.getMilliseconds() //毫秒
            };

            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return fmt;
        }
        return date;
    }
};

/**
 * [labels 标签管理]
 * @return {[type]} [description]
 */
const router = {
    // 获取手动添加标签传的参数
    params() {
        return JSON.parse(localStorage.getItem('currentKeepAlive')).params || {};
    },

    setParams(val) {
        store.commit('editKeepAliveRouter', val);
        return this;
    },

    // 添加标签
    add({ url, title, subtitle, component, params } = { subtitle: "" }) {
        store.commit('addKeepAliveRouter', {
            url,
            title,
            component,
            params,
            subtitle,
            pid: localStorage.getItem('navopenid'), // 保持当前打开导航状态
            keepid: store.state.currentKeepAlive.id, // 保持当前打开导航选中状态
            level: 2 // 手动新标签为2级导航
        });
        return this;
    },

    // 删除标签
    rm(n) {
        store.commit('removeKeepAliveRouter', n);
        return this;
    },

    // 跳转标签
    jump(n) {
        store.commit('jumpKeepAliveRouter', n);
        return this;
    },

    // 跳到指定导航
    to(n, params = '') {
        let go = null,
            nav = JSON.parse(localStorage.getItem('navdata')),
            loops = d => {
                d.some(f => {
                    if (f.component && f.component == n) {
                        params ? f.params = params : null;
                        go = f;
                        return true;
                    }

                    if (f.children && f.children.length > 0) {
                        loops(f.children);
                    }
                });
            };

        loops(nav);

        store.commit('addKeepAliveRouter', go);
    },
}

Vue.prototype.$rt = router;
Vue.prototype.$util = util;