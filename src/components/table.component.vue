<template>
    <div class="component-table">
        <div ref="toolbar" class="toolbar" :class="{ 'no-toolbar': table.topControl.length == 0 }">
            <div class="btns">
                <template v-for="(item, index) of table.topControl" v-if="table.topControl.length > 0">
                    <el-button @click="$emit('control', { action: item, rows: selection } )" size="mini" :type="item.type || ''">
                        <label>
                            <i class="iconfont" :class="item.icon"></i>
                            <span>{{ $t(item.field) }}</span>
                        </label>
                    </el-button>
                </template>
            </div>
            <!-- 中间状态 -->
            <div class="status" v-if="option.showcount">
                <ul>
                    <li v-for="item of counts">
                        <span class="key">{{ item.key }}</span>
                        <span class="val" :class="{ 'color-red': item.key == '离线' }">{{ item.val }}</span>
                    </li>
                </ul>
            </div>
            <!-- 列表设置 -->
            <div class="settings" v-if="option.showcolumn">
                <span @click="dialog = true">列表展示字段设置</span>
            </div>
        </div>

        <el-table ref="componenTable" :key="only" :data="table.data" style="width: 100%" :lazy="true" empty-text=" " @selection-change="selected" stripe :class="[option.tooltip==false ? 'show' : '']" @cell-click="cellClick" class="component-table-el" :height="option.height">

            <!-- 复选 -->
            <el-table-column v-if="option.checkbox" type="selection" width="36" fixed="left"></el-table-column>

            <!-- 序号 -->
            <el-table-column v-if="option.serialnumber" align="center" type="index" width="50" :label="$t('comp.table.number')"></el-table-column>

            <!-- 列 -->
            <template v-for="(item, index) of table.columns">
                <el-table-column v-if="item.show == undefined || item.show" :prop="item.column" :label="$t( item.field )" :width="columnWidth(item, table.columns.length)" :show-overflow-tooltip="option.tooltip" :sortable="item.sort" :class-name="item.copy ? 'copy' : ''">
                    <template slot-scope="scope" :show-overflow-tooltip="option.tooltip" >
                        <!-- 带颜色状态 -->
                        <template v-if="item.colors">
                            <span class="t" :style="{ background: columnColor(scope.row, item.colors) }">
                            {{ ( scope.row[ item.column ] && scope.row[ item.column ] !== '' && scope.row[ item.column ] !== 'null' ) || ( typeof scope.row[ item.column ] == 'number' && scope.row[ item.column ] == 0) ? scope.row[ item.column ] : '-' }}
                            </span>
                        </template>
                        <!-- 不带颜色状态 -->
                        <template v-else>
                            {{ ( scope.row[ item.column ] && scope.row[ item.column ] !== '' && scope.row[ item.column ] !== 'null' ) || ( typeof scope.row[ item.column ] == 'number' && scope.row[ item.column ] == 0) ? scope.row[ item.column ] : '-' }}
                        </template>
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
                            <template v-if="item.type == 'icon'">
                                <el-tooltip class="item" effect="dark" :content="$t( item.field )" placement="bottom">
                                    <i :class="['iconfont', item.icon]" @click="$emit('control', { action: item, row: scope.row })"></i>
                                </el-tooltip>
                            </template>

                            <!-- 文本 -->
                            <span v-if="item.type == 'text'" @click="$emit('control',{ action: item, row: scope.row })">{{ $t(item.field) }}</span>
                        </template>
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-lay" v-if="option.showpage">
            <el-pagination
                small
                background
                layout="total, prev, pager, next, sizes, jumper"
                prev-text="上一页"
                next-text="下一页"
                :page-size="table.pagination.size"
                :page-sizes="[10, 20, 30, 50, 100]"
                :total="table.pagination.total"
                :current-page="table.pagination.current"
                :style="{ textAlign: 'center', padding: '0 0 10px 0' }"
                @current-change="togglePage($event, 'current')"
                @size-change="togglePage($event, 'size')"
            ></el-pagination>
            <span class="page-tip">当前显示{{ table.pagination.current * table.pagination.size - table.pagination.size + 1 }} - {{ table.pagination.size * table.pagination.current }}条</span>
        </div>

        <el-dialog width="600px" title="列表展示字段设置" custom-class="dialog-ui component-table-setting" :visible.sync="dialog" :append-to-body="true">
            <div class="setting-columns">
                <el-checkbox-group v-model="selectedcolumn" @change="changeColumnDisplay">
                    <el-checkbox v-for="item of table.columns" :label="$t(item.field)">{{ $t(item.field) }}</el-checkbox>
              </el-checkbox-group>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
export default {
    data() {
        // table 组件默认配置
        const defaults = {
            showpage: true, // 是否显示分页
            showcount: false, // toolbar 显示的统计状态
            showcolumn: true, // 是否显示列调整功能
            serialnumber: true, // 是否显示序号
            checkbox: true ,// 是否显示复选框
            tooltip: true, // 是否显示holer;
            fixed: true, // 固定顶部和分页
            height: 'auto'
        };

        return {
            only: +new Date,
            // 组件默认配置
            option: defaults,
            dialog: false,
            table: { data: [], columnControl: [], topControl: [], columns: [], pagination: {} },
            counts: [],
            outpages: { current: 1, size: 10 },
            selection: [],
            selectedcolumn: [],
            colors: {
                '停车': '#5A8FDF',
                '离线': '#FB4C46',
                '行驶': '#27C5DD',
                '关机': '#FB4C46',
                '在线': '#5A8FDF',
                '已结束': '#D2D6DE',
                '待运发': '#D2D6DE',
                '运输完成': '#5A8FDF',
                '运输中': '#27C5DD',
                '电量正常': '#5A8FDF',
                '电量告警': '#FB4C46',
                '其他': '#D2D6DE'
            }
        }
    },
    props: ["source", "options", "count"],
    watch: {
        options(n){
            this.mergeOption( n );
            this.setTableHeight();
        },
       source(n) {
            this.table = n;
            this.outpages = {
                current: this.table.pagination.current,
                size: this.table.pagination.size
            };
        },

        count( n ){
            this.counts = n;
        }
    },
    computed: {

        ...mapState([]),

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
                        f.type == 'icon' ? w += 40 : f.type == 'text' ? w += (text.length / 2) * 13 + 10 : null;
                });

                return w + 10;
            }
        },

        /**
         * [columnWidth 列宽度计算]
         * @return {[type]} [description]
         */
        columnWidth(){
            return (item, length) => item.width ? item.width : length < 10 ?  'auto' : 200;
        },

        /**
         * [columnColor 列字段颜色显示]
         * // row.xxxx == 'xxx' ? '' : ''
         * @return {[type]} [description]
         */
        columnColor(){
            return (row, colors) => {
                return this.colors[eval(colors)];
            }
        },
    },
    created(){
        this.table = this.source;
        this.counts = this.count;
        this.mergeOption( this.options );
    },
    mounted(){
        if( this.option.height == 'auto' ){
            this.setTableHeight();
            window.addEventListener('resize', this.setTableHeight);
        }
    },
    methods: {
        setTableHeight(){
            this.$nextTick(() => {
                const   dh = document.documentElement.offsetHeight,
                        hh = document.querySelector('.views>.header'),
                        fh = document.querySelector('.main>div>.box:nth-child(1)');

                // 页面高度 - 标签高度 - 筛选框高度 - 表格 toolbar 高度 - 表头高度 - 分页高度 - 表格容器填充像素
                this.option.height = dh - (hh ? hh.offsetHeight : 0) - (fh ? fh.offsetHeight + 10 : 0) - this.$refs.toolbar.offsetHeight - 40 - ( this.option.showpage ? 26 : 0) - 30;
            });
        },

        mergeOption( n ){
            this.option = Object.assign({}, this.option, n);
            this.selectedcolumn = this.table.columns.filter( f => f.show == undefined || f.show ).map( m => this.$t(m.field) );
        },

        selected(selection) {
            this.selection = selection;
            this.$emit('selected', selection);
        },

        togglePage( val, type ){
            type == 'size' ? this.outpages.current = 1 :'';
            this.outpages[ type ] = val;
            this.$emit('pages', this.outpages);
        },

        cellClick( row, column, cell, event){
            this.$emit('cellclick', { row, column, cell, event });
        },

        changeColumnDisplay( val ){
            this.only = +new Date;
            this.table.columns.forEach( (f, index) => {
                const bool = val.some( s => s == this.$t( f.field) );
                this.$set(this.table.columns[index], 'show', bool );
            });
        },

        /**
         * [toggleRowSelection description]
         * @param  {[type]} rows [description]
         * @param  {String} key  [指定匹配字段, 然后从表格数据中获取]
         * @param  {String} speed  [elementUi 弹框动画效果延迟处理]
         * @return {[type]}      [description]
         */
        toggleRowSelection({ rows, key, delay } = { key: 'id', delay: 0 }){
            setTimeout( () => {
                const   table = this.$refs.componenTable,
                        data = this.table.data.filter( f => rows.some( s => f[ key ] === s[ key ] ) ); // 从表格数据中筛选

                table.clearSelection();

                if (rows) {
                    data.forEach( row => table.toggleRowSelection( row ));
                }
            }, delay);
        }
    },

    beforeDestroy(){
        window.removeEventListener('resize', this.setTableHeight);
    }
}

</script>
<style scoped lang="scss">
    .component-table {
        margin: 0 10px;
        overflow: hidden;
        width: calc(100% - 20px);

        // .toolbar {
        //     padding: 10px 0;

        //     &.no-toolbar { padding: 20px 0 0 0; }

        //     button {
        //         cursor: pointer;
        //         height: 32px;
        //         min-width: 100px;
        //         padding: 0 15px;
        //     }

        //     label {
        //         align-items: center;
        //         cursor: pointer;
        //         display: flex;
        //         font-size: 12px;

        //         span {
        //             line-height: 16px;
        //         }

        //         i { margin-right: 5px; }
        //     }
        // }

        .cell {

            button {
                display: inline-block;
                height: 32px;
                overflow: hidden;
                vertical-align: middle;
            }
        }

        .component-table-el {
            margin-bottom: 10px;
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
                color: #5A8FDF;
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

        .page-lay {
            align-items: center;
            display: flex;
            justify-content: center;

            .page-tip {
                color: #606266;
                font-weight: bold;
                height: 32px;
                line-height: 22px;
                margin-left: 15px;
                padding: 0 0 10px 0;
            }
        }
    }
</style>
<style lang="scss">
    .toolbar {
        display: flex;
        height: 52px;
        padding: 10px 0;

        &.out {
            padding: 0 10px 10px 10px;
        }

        &.no-toolbar {
            height: 0;
            padding: 10px 0 0 0;
        }

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

        .btns {
            flex: 1;
            height: 32px;
            span {
                color: #535965;
            }
        }

        .status {
            height: 32px;
            ul {
                align-items: center;
                display: flex;
                height: 100%;

                li {
                    margin-left: 15px;
                }

                .key {

                }

                .val {
                    color: #5A8FDF;
                    padding: 0 0 0 5px;
                }
            }
        }

        .settings {
            align-items: center;
            display: flex;
            height: 32px;
            padding-left: 30px;

            span {
                color: #5A8FDF;
                cursor: pointer;
                font-size: 12px;
            }
        }
    }

    .setting-columns {
        .el-checkbox-group {
            display: flex;
            flex-wrap: wrap;

            label {
                margin-bottom: 10px;
                width: 110px;
                &:nth-child(4n){
                    margin-right: 0;
                }
            }
        }
    }
</style>
