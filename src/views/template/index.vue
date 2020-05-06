<template>
    <div class="page-template">
        <div class="box">
            <FilterComponent :source="filterdata" @getvalue="filterOutvalue"></FilterComponent>
        </div>

        <div class="box">
            <TableComponent :source="tabledata" @control="tableControls"></TableComponent>
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
                    field: 'testtextarea',
                    label: 'template.filter.studentid',
                    type: 'textarea',
                    disabled: false,
                    placeholder: 'comp.filter.placeholder.textarea',
                    remoteurl: 'http://google.com', // 搜索接口
                },
                {
                    field: 'testinput',
                    label: 'template.filter.name',
                    type: 'input',
                    disabled: false,
                    readonly: false,
                    placeholder: 'comp.filter.placeholder.input',
                    value: '漩涡鸣人'
                },

                {
                    field: 'testselect',
                    keys: 'label,value',
                    label: 'template.filter.sex',
                    type: 'select',
                    disabled: false,
                    placeholder: 'comp.filter.placeholder.select',
                    data: 'sex', // 字符串(静态数据源key)或者数组
                    value: 1 // 默认值为数据源的 value
                },

                {
                    field: 'testremoteselect',
                    keys: 'label,value',
                    label: 'template.filter.grade',
                    type: 'remoteselect',
                    disabled: false,
                    placeholder: 'comp.filter.placeholder.remoteselect',
                    remoteurl: 'http://google.com', // 搜索接口
                },
            ],

            // 表格配置
            tabledata: {
                data: [{ name: '张三', sex: '男' },{ name: '李四', sex: '女' }], // 表格数据
                columns: [
                    { field: 'template.table.columns.name', column: 'name'},
                    { field: 'template.table.columns.sex', column: 'sex', width: 100 }
                ], // 显示的列
                topControl: [{ field: 'template.table.btns.test', code: 'test', icon: 'icon-zengjia2' }], // 顶部按钮
                columnControl: [
                    { field: 'template.table.btns.del', code: 'del', type:'icon', icon: 'icon-shanchu1', if:'true' },
                    { field: 'template.table.btns.edit', code: 'edit', type:'text', icon: '', if:'true' },
                    { field: 'template.table.btns.detail', code: 'detail', type:'text', icon: 'icon-shanchu1', if:'true' }
                ], // 操作按钮
                pagination: {
                    size: 10,
                    page: 1,
                    total: 1,
                } // 分页参数
            }
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
        },

        tableControls( val ){
            console.log('tablecontrol', val);
            // switch( val.action ){
            //     case 'test': return;
            //     case 'del': return;
            // }
        }
    }
};
</script>
<style scoped lang="scss">

</style>