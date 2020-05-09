<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
    import { mapMutations, mapState } from "vuex";
    export default {
        name: 'App',
        data(){
            return {
                theme: 'default-theme'
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
            this.toggleTheme();
            this.rem();
            window.addEventListener('resize', this.rem, false);
        },
        methods: {
            ...mapMutations(['empty']),

            toggleTheme(){
                document.querySelector('body').classList.add( this.theme );
            },

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
