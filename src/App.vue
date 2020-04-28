<template>
    <div id="app" :class="theme">
        <router-view />
    </div>
</template>
<script>
    import { mapMutations, mapState } from "vuex";
    export default {
        name: 'App',
        data(){
            return {
                theme: 'theme'
            }
        },
        computed: {
            ...mapState([])
        },
        watch: {
            '$route'(to, from){
                this.rem();
            }
        },
        mounted(){
            this.rem();
            window.addEventListener('resize', this.rem, false);
        },
        methods: {
            ...mapMutations(['empty']),

            rem(){
                let whdef = 100 / 1920,
                    wH = window.innerHeight,
                    wW = window.innerWidth,
                    rem = wW * whdef;
                document.querySelector('html').style.fontSize = rem + 'px';
            }
        },
        beforeDestroy(){
            window.removeEventListener('resize', this.rem);
        }
    }
</script>
<style scoped lang="scss">
</style>
