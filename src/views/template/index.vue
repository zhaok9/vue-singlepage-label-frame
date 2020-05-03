<template>
    <div class="page-template">
        <div class="box">
            <FilterComponent :source="filterdata" @getvalue="filterOutvalue"></FilterComponent>
        </div>
    </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
export default {
    name: "Page-template",
    data() {
        return {
            // 筛选组件
            filterdata: [
                {
                    key: 'testtextarea',
                    label: 'template.filter.studentid',
                    type: 'textarea',
                    disabled: false,
                    placeholder: 'comp.filter.placeholder.textarea',
                    remoteurl: 'http://google.com', // 搜索接口
                },
                {
                    key: 'testinput',
                    label: 'template.filter.name',
                    type: 'input',
                    disabled: false,
                    readonly: false,
                    placeholder: 'comp.filter.placeholder.input',
                    value: '漩涡鸣人'
                },

                {
                    key: 'testselect',
                    label: 'template.filter.sex',
                    type: 'select',
                    disabled: false,
                    placeholder: 'comp.filter.placeholder.select',
                    data: 'sex', // 字符串(静态数据源key)或者数组
                    value: '' // 默认值为数据源的 value
                },

                {
                    key: 'testremoteselect',
                    label: 'template.filter.grade',
                    type: 'remoteselect',
                    disabled: false,
                    placeholder: 'comp.filter.placeholder.remoteselect',
                    remoteurl: 'http://google.com', // 搜索接口
                },

            ]
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

        filterOutvalue( val ){
            console.log('filter', val);
        }
    }
};
</script>
<style scoped lang="scss">

</style>