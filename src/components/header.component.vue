<template>
    <div class="component-header">
        <a href="#" class="logo">
            <img v-if="navigation" src="/static/image/sinotrans/logo.png" width="200" height="24" alt="">
            <img v-if="!navigation" src="/static/image/sinotrans/logo2.png" width="51" height="24" alt="">
        </a>
        <i class="iconfont icon-caidan2 toggle" :class="{ rotate: !navigation }" @click.stop="toggleNav"></i>
        <div class="right">
            <span><i class="iconfont icon-xiazai"></i></span>
            <span><i class="iconfont icon-xiaoxi"></i></span>
            <span>
                <i class="iconfont icon-bangzhu"></i>
            </span>
            <a href="#" class="openapi">开放API</a>
            <el-select v-model="languaged" placeholder="请选择" @change="toggleLanguage">
                <el-option
                    v-for="item in language"
                    :key="item.type"
                    :label="item.label"
                    :value="item.type">
                </el-option>
            </el-select>
            <span class="user">
                <img :src="userinfo.icon" alt="" width="24" height="24">
                <label for="">{{ userinfo.userName }}</label>
            </span>
            <span>
                <i @click="exit" class="iconfont icon-tuichu"></i>
            </span>
        </div>
    </div>
</template>
<script>
    import { mapMutations, mapState } from "vuex";
    export default {
        name: "ComponentHeader",
        data() {
            return {
                language: [{ type:'zh', label:'简体中文' }, { type: 'en', label: 'English' }],
                languaged: localStorage.getItem('locale') || 'zh'
            }
        },
        props: [],
        watch: {
        },
        computed: {
            ...mapState(["navigation", "userinfo"]),
        },
        created(){},
        mounted(){

        },
        methods: {
            ...mapMutations(["toggleNavigation", "empty"]),

            toggleNav(){
                this.toggleNavigation( !this.navigation );
            },

            toggleLanguage( type = 'zh' ){
                localStorage.setItem('locale', type);
                document.querySelector('.loading-text span').innerHTML = type == 'zh' ? '正在准备数据' : 'Data is being prepared';
                this.$i18n.locale = type;
            },

            exit(){
                this.empty();
                this.$message.success('您已成功退出账号');
                setTimeout( () => location.reload(), 500);
            }
        },
        beforeDestroy(){

        }
    }
</script>
<style scoped lang="scss">
    .component-header {
        align-items: center;
        display: flex;
        height: 100%;

        .logo {
            font-size: 0;
            padding: 0 10px;
        }

        .toggle {
            cursor: pointer;
            font-size: 20px;
        }

        .rotate {
            position: relative;
            top: -1px;
            transform: rotate(180deg);
        }

        .right {
            align-items: center;
            display: flex;
            justify-content: flex-end;
            flex: 1;
            padding: 0 15px 0 0;

            span { cursor: pointer;  font-size: 12px; margin-left: 38px; }

            i { font-size: 16px; }

            .openapi {
                margin: 0 20px 0 30px;
                text-decoration: none;
            }

            .user {
                align-items: center;
                display: flex;
                margin-left: 30px;
                img { background: #E5E5E5; border-radius: 100%; }
                label { margin-left: 10px; }
            }
        }

    }
</style>

<style lang="scss">
    .component-header {
        .el-select { width: 95px; }
        .el-input__inner {
            border: none;
            background: none;
            color: #fff;
            text-align: center;
        }
    }
</style>
