import Vue from 'vue';

const   h = Vue.prototype.http,
        f = (...a) => {

            const u = a[0].split(':');

            try { h[ u[0] ]( u[1], a[ 1 ] ).then( res => a[ 2 ]( res.data )) }

            catch{ console.log('Error api') }
        },
        api = {
            testApi: (params, callback) => f('post:/user/getUserInfoByUserUId', params, callback)
        };

Vue.prototype.api = api;
