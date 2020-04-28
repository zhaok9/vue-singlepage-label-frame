<template>
    <div class="page-template">
        template
    </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
export default {
    name: "Page-template",
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
        ...mapMutations([]),
    }
};
</script>
<style scoped lang="scss">

</style>