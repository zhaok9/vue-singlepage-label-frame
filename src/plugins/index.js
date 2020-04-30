import Vue from 'vue';

const util = {
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
    }
};

Vue.prototype.$u = util;