<template>
    <div class="page-home">
        home
    </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
export default {
    name: "Page-home",
    data() {
        return {
        };
    },
    computed: {
        ...mapState([])
    },
    watch: {
        $route(to, from) {
        }
    },
    created() {},
    mounted() {

    },
    methods: {
        ...mapMutations([])
    }
};
</script>
<style scoped lang="less">

</style>