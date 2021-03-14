<template>
    <div class="page-template">
         <div class="box">
            <FilterComponent lw="100%" rw="33.333%" :source="filterdata" @getvalue="filterOutvalue" @on-off="setTableHeight"></FilterComponent>
        </div>

        <div class="box">
            <TableComponent :source="tabledata" :options="tableoptions" @control="tableControls"></TableComponent>
        </div>

        <el-dialog
            title="弹框"
            custom-class="dialog-ui"
            width="30%"
            :visible.sync="dialogVisible"
            :append-to-body="true"
            :before-close="dialogClose">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="dialogVisible = false">保存</el-button>
                <el-button size="mini" @click="dialogVisible = false">取消</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
export default {
    name: "Page-template",
    data() {
        return {
            dialogVisible: false,

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
                    value: 1, // 默认值为数据源的 value
                    i18n: true,
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
            tableoptions: {},
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
                    current: 1,
                    total: 1,
                } // 分页参数
            },

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

        setTableHeight(){
            this.tableoptions = Object.assign({}, this.tableoptions);
        },

        filterOutvalue( val ){
            console.log('filter', val);
        },

        tableControls( val ){
            console.log('tablecontrol', val);
            // switch( val.action ){
            //     case 'test': return;
            //     case 'del': return;
            // }
        },

        selectAreaValue( val ){
            console.log(val);
        },

        selectAreaScrollBottom(){
            const len = this.selectarea.length;
            for( let i = len; i < len + 10; i++ ){
                this.selectarea.push({
                    id: i,
                    name: '测试' + i,
                    sex: '男',
                    age: i
                });
            }
        },

        dialogClose(){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
};
</script>
<style scoped lang="less">
    
</style>