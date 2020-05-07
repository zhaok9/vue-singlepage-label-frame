<template>
    <div class="component-table">
        <div class="toolbar" :class="{ 'no-toolbar': table.topControl.length == 0 }">
            <template v-for="(item, index) of table.topControl" v-if="table.topControl.length > 0">
                <el-button @click="$emit('control', { action: item, rows: selection } )" size="mini">
                    <label>
                        <i class="iconfont" :class="item.icon"></i>
                        <span>{{ $t(item.field) }}</span>
                    </label>
                </el-button>
            </template>
        </div>

        <el-table :data="table.data" style="width: 100%" :lazy="true" empty-text=" " @selection-change="selected" stripe :class="[option.tooltip==false ? 'show' : '']">

            <!-- 复选 -->
            <el-table-column v-if="option.checkbox" type="selection" width="36" fixed="left"></el-table-column>

            <!-- 序号 -->
            <el-table-column v-if="option.serialnumber" align="center" type="index" width="60" :label="$t('comp.table.number')"></el-table-column>

            <!-- 列 -->
            <template v-for="(item, index) of table.columns">
                <el-table-column :prop="item.column" :label="$t( item.field )" :width="columnWidth(item, table.columns.length)" :show-overflow-tooltip="option.tooltip">
                    <template slot-scope="scope" :show-overflow-tooltip="option.tooltip" >
                        {{ ( scope.row[ item.column ] && scope.row[ item.column ] != '' ) || scope.row[ item.column ] == 0 ? scope.row[ item.column ] : '-' }}
                    </template>
                </el-table-column>
            </template>

            <!-- 操作列 -->
            <el-table-column
                v-if="table.columnControl.length > 0"
                fixed="right"
                class-name="table-controls"
                :label="$t('comp.table.operating')"
                :width="controlWidth()">
                <template slot-scope="scope">
                    <template v-for="(item, index) of table.columnControl">
                        <template v-if="$eval(scope.row, item.if) ">
                            <!-- 图标 -->
                            <i v-if="item.type == 'icon'" :class="['iconfont', item.icon]" @click="$emit('control', { action: item, row: scope.row })"></i>

                            <!-- 文本 -->
                            <span v-if="item.type == 'text'" @click="$emit('control',{ action: item, row: scope.row })">{{ $t(item.field) }}</span>
                        </template>
                    </template>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            v-if="option.showpage"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-size="table.pagination.size"
            :page-sizes="[10, 20, 30, 50]"
            :total="table.pagination.total"
            :current-page="table.pagination.current"
            :style="{ textAlign: 'center', padding: '20px 0' }"
            @current-change="togglePage($event, 'current')"
            @size-change="togglePage($event, 'size')"
        ></el-pagination>
    </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
export default {
    data() {
        // table 组件默认配置
        const defaults = {
            showpage: true, // 是否显示分页
            serialnumber: true, // 是否显示序号
            checkbox: true ,// 是否显示复选框
            tooltip: true, // 是否显示holer;
            fixed: true, // 固定顶部和分页
        };

        return {
            // 组件默认配置
            option: defaults,
            table: { data: [], columnControl: [], topControl: [], column: [], pagination: {} },
            outpages: { current: 1, size: 10 },
            selection: []
        }
    },
    props: ["source", "options"],
    watch: {
        options(n){
            this.option = Object.assign({}, this.option, n);
        },
        source(n) {
            this.table = n;
            this.outpages = {
                current: this.table.pagination.current,
                size: this.table.pagination.size
            };
        }
    },
    computed: {

        ...mapState(['status']),

        /**
         * [$eval 列按钮判断条件]
         * @return {[type]} [description]
         */
        $eval(){
            // ifs: 'row.xxx||row.xxx'
            return (row, ifs) => ifs ? eval(ifs) : true;
        },

        formatTime(){
            return val => {
                const date = new Date( val );
                return `${ date.getFullYear() }-${ date.getMonth()+1 }-${ date.getDay() } ${ date.getHours() }:${ date.getMinutes() }:${ date.getSeconds()}`
            }
        },

        /**
         * [controlWidth 操作列宽度计算]
         * @return {[type]} [description]
         */
        controlWidth(){
            return () => {
                const   controls = this.table.columnControl,
                        lag = localStorage.getItem('locale') || 'zh';

                let w = 0;

                controls.forEach( f => {
                    let text = this.$t( f.field );

                    lag == 'zh' ?
                        f.type == 'icon' ? w += 40 : f.type == 'text' ? w += text.length * 12 + 10 : null :
                        f.type == 'icon' ? w += 40 : f.type == 'text' ? w += (text.length / 2) * 12 + 10 : null;
                });

                return w;
            }
        },

        /**
         * [columnWidth 列宽度计算]
         * @return {[type]} [description]
         */
        columnWidth(){
            return (item, length) => item.width ? item.width : length < 10 ?  'auto' : 130;
        }
    },
    created(){
        this.option = Object.assign({}, this.option, this.options);
    },
    mounted(){
        this.table = this.source;
    },
    methods: {
        selected(selection) {
            this.selection = selection;
            this.$emit('selected', selection);
        },

        togglePage( val, type ){
            type == 'size' ? this.outpages.current = 1 :'';
            this.outpages[ type ] = val;
            this.$emit('pages', this.outpages);
        }
    },

    beforeDestroy(){

    }
}

</script>
<style scoped lang="scss">
    .component-table {
        margin: 0 25px;
        width: calc(100% - 50px);

        .toolbar {
            padding: 20px 0;

            &.no-toolbar { padding: 20px 0 0 0; }

            button {
                cursor: pointer;
                height: 32px;
                min-width: 100px;
                padding: 0 15px;
            }

            label {
                align-items: center;
                cursor: pointer;
                display: flex;
                font-size: 12px;

                span {
                    line-height: 16px;
                }

                i { margin-right: 5px; }
            }
        }

        .cell {

            button {
                display: inline-block;
                height: 32px;
                overflow: hidden;
                vertical-align: middle;
            }
        }

        .table-controls {

            span {
                cursor: pointer;
                height: 20px;
                line-height: 20px;
                margin: 0 10px 0 0;
                overflow: hidden;
            }

            i {
                color: #4290be;
                cursor: pointer;
                display: inline-block;
                font-size: 20px;
                height: 20px;
                line-height: 20px;
                margin: 0 10px 0 0;
                overflow: hidden;
                width: 20px;
            }
        }
    }

</style>
