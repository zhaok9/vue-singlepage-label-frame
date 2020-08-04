import Vue from 'vue';

const   h = Vue.prototype.http,
        f = (...a) => {

            const u = a[0].split(':');

            try { h[u[0]](u[1], a[1]).then(res => a[2]( a[3] ? res : res.data)).catch( e => {

                console.log('Api catch:', e);

                if( e.response ){
                    const code = e.response.status;

                    a[2]({
                        code: code,
                        msg: STATIC_SOURCE['serverCode'][ code ] || STATIC_SOURCE['serverCode']['default']
                    });

                    if( code == 401 ){
                        store.commit('empty');
                        setTimeout(() => location.reload(), 3000 );
                    }
                }

            }) } catch { console.log('Error api') }
        },
        api = {
            testApi: (params, callback) => f('post:/user/getUserInfoByUserUId', params, callback)
        };

Vue.prototype.api = api;
