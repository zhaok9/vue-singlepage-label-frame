<template>
    <div class="component-header">
        <i class="iconfont icon-caidan2 toggle" @click.stop="toggleNav"></i>
    </div>
</template>
<script>
    import { mapMutations, mapState } from "vuex";
    export default {
        name: "ComponentHeader",
        data() {
            return {
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
    }
</style>
