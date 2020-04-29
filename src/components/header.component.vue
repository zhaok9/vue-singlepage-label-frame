<template>
    <div class="component-header">
        <i class="iconfont icon-caidan2 toggle" :class="{ rotate: !navigation }" @click.stop="toggleNav"></i>
        <el-select v-model="languaged" placeholder="请选择" @change="toggleLanguage">
            <el-option
                v-for="item in language"
                :key="item.type"
                :label="item.label"
                :value="item.type">
            </el-option>
        </el-select>
    </div>
</template>
<script>
    import { mapMutations, mapState } from "vuex";
    export default {
        name: "ComponentHeader",
        data() {
            return {
                language: [{ type:'zh', label:'简体中文' }, { type: 'en', label: '英文' }],
                languaged: localStorage.getItem('locale') || 'zh'
            }
        },
        props: [],
        watch: {
        },
        computed: {
            ...mapState(["navigation"]),
        },
        created(){},
        mounted(){

        },
        methods: {
            ...mapMutations(["toggleNavigation"]),

            toggleNav(){
                this.toggleNavigation( !this.navigation );
            },

            toggleLanguage( type ){
                localStorage.setItem('locale', type);
                this.$i18n.locale = type;
            }
        },
        beforeDestroy(){

        }
    }
</script>
<style scoped lang="scss">
    .component-header {
        .toggle {
            cursor: pointer;
            font-size: 20px;
        }

        .rotate {
            position: relative;
            top: -1px;
            transform: rotate(180deg);
        }
    }
</style>
