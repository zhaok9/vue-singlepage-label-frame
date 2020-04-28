import HeaderComponent from './header.component';
import NavComponent from './nav.component';
import LablesComponent from './labels.component';

const
    Register = [
        // global true 注册成为全局组件, 在 vue 页面不需要 import
        // global false 不注册成为全局组件, 在 vue 页面使用需要单独 import 组件
        { name: 'HeaderComponent', component: HeaderComponent, global: true },
        { name: 'NavComponent', component: NavComponent, global: true },
        { name: 'LablesComponent', component: LablesComponent, global: true },
    ],
    Components = {
        install( Vue ) {
            // 注册组件
            Register.forEach( val => {
                if( val.global ){
                    Vue.component( val.name, val.component );
                }
            });
        }
    };

export default Components;