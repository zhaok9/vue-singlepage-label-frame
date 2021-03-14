<template>
    <div class="component-filter">
        <div class="filter-body" :class="{ off: off }">
            <div class="left">
                <div class="left-textarea" v-if="areas.length > 0" :style="{ flex: areas.length }">
                    <template v-for="item of areas">
                        <div class="filter-row" :style="{ width: lw ? `calc(${lw} - 10px)` : 'calc(50% - 10px)' }">
                            <el-tooltip v-if="$util.strlen( $t(item.label) ) > 10" class="item" effect="dark" :content="$t(item.label)" placement="top">
                                <span class="filter-label">
                                    {{ $t(item.label) }}
                                </span>
                            </el-tooltip>
                            <span v-else class="filter-label">
                                {{ $t(item.label) }}
                            </span>

                             <!-- 文本域 -->
                            <el-input
                                v-model="outval[ item.field ]"
                                type="textarea"
                                :placeholder="$t( item.placeholder )"
                                :disabled="item.disabled"
                                :readonly="item.readonly">
                            </el-input>
                        </div>
                    </template>
                </div>
                <div class="left-other" :style="{ flex: 4 - areas.length }">
                    <template v-for="item of other">
                        <div class="filter-row" :style="{ width: rw ? `calc(${rw} - 10px)` : 'calc(50% - 10px)' }">
                            <el-tooltip v-if="$util.strlen( $t(item.label) ) > 10" class="item" effect="dark" :content="$t(item.label)" placement="top">
                                <span class="filter-label">
                                    {{ $t(item.label) }}
                                </span>
                            </el-tooltip>
                            <span v-else class="filter-label">
                                {{ $t(item.label) }}
                            </span>

                            <!-- 文本框  -->
                            <el-input
                                v-if="item.type == 'input'"
                                v-model="outval[ item.field ]"
                                :placeholder="$t( item.placeholder) + $t(item.label)"
                                :disabled="item.disabled"
                                :readonly="item.readonly">
                            </el-input>

                            <!-- 普通下拉框 -->
                            <el-select
                                v-if="item.type == 'select'"
                                v-model="outval[ item.field ]"
                                :popper-append-to-body="false"
                                :placeholder="$t( item.placeholder ) + $t(item.label)"
                                :disabled="item.disabled">
                                <el-option
                                    v-for="sel in (typeof item.data === 'string' ? STATIC_SOURCE[ item.data ] : item.data )"
                                    :key="sel[ item.keys[1] ]"
                                    :label="item.i18n ? $t(sel[ item.keys[0] ]) : sel[ item.keys[0] ]"
                                    :value="sel[ item.keys[1] ]">
                                </el-option>
                            </el-select>

                            <!-- 远程搜索拉 -->
                            <el-select
                                v-if="item.type == 'remoteselect'"
                                v-model="outval[ item.field ]"
                                filterable
                                remote
                                :popper-append-to-body="false"
                                :disabled="item.disabled"
                                :placeholder="$t( item.placeholder )"
                                :remote-method="remoteMethod"
                                :loading="loading"
                                @focus="remoteSelected( item )">
                                <el-option
                                    v-for="sel in remotelist[ item.field ]"
                                    :key="sel[ item.keys[1] ]"
                                    :label="item.i18n ? $t(sel[ item.keys[0] ]) : sel[ item.keys[0] ]"
                                    :value="sel[ item.keys[1] ]">
                                </el-option>
                            </el-select>

                            <!-- 日期选择器   -->
                            <el-date-picker
                                v-if="item.type == 'daterange'"
                                v-model="outval[ item.field ]"
                                type="daterange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :range-separator="$t('comp.filter.to')"
                                :start-placeholder="$t('comp.filter.starttime')"
                                :end-placeholder="$t('comp.filter.endtime')"
                                @change="dateVerify( $event, item )">
                            </el-date-picker>

                            <!-- 查询数据时间 -->
                            <el-date-picker
                                v-if="item.type == 'datetimerange'"
                                v-model="outval[ item.field ]"
                                type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :range-separator="$t('comp.filter.to')"
                                :start-placeholder="$t('comp.filter.starttime')"
                                :end-placeholder="$t('comp.filter.endtime')"
                                @change="dateVerify( $event, item )">
                            </el-date-picker>

                            <!-- fros 单日期组件 -->
                            <fros-date-picker
                                v-if="item.type == 'frosdate'"
                                class="fros-form-item-center"
                                ref="datePicker"
                                type="date"
                                placeholder="请选择日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                v-model="outval[ item.field ]"
                                :disabled=false
                                :readonly=false>
                            </fros-date-picker>


                        </div>
                    </template>
                </div>

                <div class="left-lang">
                    <template v-for="item of lang">
                        <div class="filter-row">
                            <template v-if="item.label">
                                <el-tooltip v-if="$util.strlen( $t(item.label) ) > 10" class="item" effect="dark" :content="$t(item.label)" placement="top">
                                    <span class="filter-label">
                                        {{ $t(item.label) }}
                                    </span>
                                </el-tooltip>
                                <span v-else class="filter-label">
                                    {{ $t(item.label) }}
                                </span>
                            </template>

                            <!-- 选择查询组件 -->
                            <div class="selectquery"  v-if="item.type == 'lang:selectquery'">
                                <el-select
                                    v-model="selectquery[ item.field ]"
                                    :popper-append-to-body="false"
                                    :placeholder="$t( item.placeholder ) + $t(item.label)"
                                    :disabled="item.disabled"
                                    @change="selectQueryChange( $event, item )">
                                    <el-option
                                        v-for="sel in (typeof item.data === 'string' ? STATIC_SOURCE[ item.data ] : item.data )"
                                        :key="sel[ item.keys[1] ]"
                                        :label="item.i18n ? $t(sel[ item.keys[0] ]) : sel[ item.keys[0] ]"
                                        :value="sel[ item.keys[1] ]">
                                    </el-option>
                                </el-select>
                                <!-- 文本域 -->
                                <el-input
                                    v-model="outval[ selectquery[ item.field ] ]"
                                    type="textarea"
                                    :placeholder="$t( item.placeholder )"
                                    :disabled="item.disabled"
                                    :readonly="item.readonly">
                                </el-input>
                            </div>

                            <!-- 快捷时间查询 -->
                            <div class="clocker" v-if="item.type == 'lang:clocker'">
                                <el-radio-group v-model="searchtime" @change='changeSearchTime' size="mini">
                                    <el-radio-button label="1">今日</el-radio-button>
                                    <el-radio-button label="2">昨日</el-radio-button>
                                    <el-radio-button label="3">本周</el-radio-button>
                                    <el-radio-button label="4">上周</el-radio-button>
                                    <el-radio-button label="5">本月</el-radio-button>
                                    <el-radio-button label="6">上月</el-radio-button>
                                </el-radio-group>
                                <fros-date-picker
                                    class="fros-form-item-center"
                                    ref="datePicker"
                                    v-model="outval[item.field[0]]"
                                    value-format="yyyy-MM-dd hh:mm:ss"
                                    type="date"
                                    placeholder="请选择日期"
                                    size="large">
                                </fros-date-picker>
                                &nbsp;至&nbsp;
                                 <fros-date-picker
                                    class="fros-form-item-center"
                                    ref="datePicker"
                                    v-model="outval[item.field[1]]"
                                    value-format="yyyy-MM-dd hh:mm:ss"
                                    type="date"
                                    placeholder="请选择日期"
                                    size="large">
                                </fros-date-picker>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <div class="right">
                <el-button size="small" type="primary" @click="output">{{ $t('comp.filter.search') }}</el-button>
                <el-button v-if="option.showreset" size="small" @click="reset">{{ $t('comp.filter.reset') }}</el-button>
            </div>
        </div>

        <span class="toggle" @click="toogleFilter" v-if="option.showtoggle">
            <i class="iconfont icon-xiaoyuhao"></i>
        </span>

    </div>
</template>
<script>
    import { mapMutations, mapState } from "vuex";
    export default {
        name: "ComponentFilter",
        data() {
            const defaults = {
                showreset: true,
                showtoggle: true,
            };

            return {
                option: defaults,
                loading: false,
                configs: [], // 筛选配置
                areas: [],
                other: [],
                lang: [],
                selectquery: {},
                outval: {}, // 返回数据
                remotelist: {}, // 远程搜索下拉数据源
                remoteselected: null,
                off: false,
                verify: true, // 验证是否通过
                sqc_old: '',
                searchtime:"5",//快捷时间
            }
        },
        props: ["source", "lw", "rw", "options", "empty"],
        watch: {
            source(n){
                this.configs = n;
                this.defaultValue();
            },
            empty( n ){
                n ? this.reset() : null;
            }
        },
        computed: {
            ...mapState(["STATIC_SOURCE"]),
        },
        created(){
            this.option = Object.assign({}, this.option, this.options);
        },
        mounted(){
            this.configs = this.source;
            this.defaultValue();
            this.areas = this.configs.filter( f => f.type == 'textarea');
            this.other = this.configs.filter( f => f.type != 'textarea' && !f.type.includes('lang:'));
            this.lang = this.configs.filter( f => f.type == 'lang:selectquery' || f.type == 'lang:clocker');
        },
        methods: {
            ...mapMutations(["setEnableLoad"]),
            reset(){
                for( let field in this.outval ){
                    this.outval[ field ] = '';
                }
            },

            /**
             * [defaultValue 设置默认值]
             * @return {[type]} [description]
             */
            defaultValue(){
                this.configs.forEach( c => {
                    c.type == 'select' ||
                    c.type == 'remoteselect' ||
                    c.type == 'lang:selectquery' ?
                    c.keys = c.keys.split(',') : null;
                    c.type == 'lang:clocker' ?
                    c.field = c.field.split(',') : null;

                    switch (c.type) {
                        case 'select':
                        case 'remoteselect':
                        case 'input':
                        case 'textarea': return this.$set( this.outval, c.field, c.value || '');
                        case 'datetimerange': return this.$set( this.outval, c.field, c.value || [] );
                        case 'lang:selectquery': return (
                            this.$set( this.selectquery, c.field, c.value || ''),
                            this.sqc_old = c.value || ''
                        );
                    }
                });
            },

            /**
             * [remoteSelected 获取焦点的远程搜索]
             * @param  {[type]} item [description]
             * @return {[type]}      [description]
             */
            remoteSelected( item ){
                this.remoteselected = item;
            },

            /**
             * [remoteMethod 远程搜索方法]
             * @param  {[type]} query [description]
             * @return {[type]}       [description]
             */
            remoteMethod(query){
                if (query !== '') {
                    this.loading = true;
                    this.setEnableLoad( true );

                    setTimeout(() => {
                        let u = this.remoteselected.remoteurl.split(':'),
                            p = {};

                        p[ this.remoteselected.params ] = query;

                        this.http[ u[0] ]( u[1], p ).then( res => {
                            this.loading = false;
                            this.setEnableLoad( false );

                            let d = res.data;
                            d.code == 0 ?  this.$set( this.remotelist, this.remoteselected.field, d.data.records || d.data ) : null;
                        });

                    }, 200);
                }
            },

            /**
             * [toogleFilter 展开收起筛选框]
             * @return {[type]} [description]
             */
            toogleFilter(){
                this.off = !this.off;
                this.$emit('on-off', this.off);
            },

            /**
             * [dateVerify 日期组件验证]
             * @param  {[type]} val [description]
             * @return {[type]}      [description]
             */
            dateVerify( val, item ){
                if( val && item.limit ){
                    let st = +new Date(val[0]),
                        et = +new Date(val[1]),
                        limit = item.limit.split(':'), // 值:单位  1:y, 1:M, 1:d, 1:h, 1:m, 1:s
                        unit = {
                            y: '年',
                            M: '个月',
                            d: '天',
                            h: '小时',
                            m: '分钟',
                            s: '秒'
                        };

                    (et - st)  / 3600 / 1000 / 24 > limit[0] ?
                    (

                        this.$message.warning(`${ this.$t('datalog.filter.time') }最大跨度为${ limit[0] }${ unit[ limit[1] ] }`),
                        this.verify = false

                    ): this.verify = true;
                }
            },

            /**
             * [selectQueryChange 改变选择查询]
             * @return {[type]} [description]
             */
            selectQueryChange( val, item ){
                this.sqc_old ? this.outval[ this.sqc_old ] = '' : null;
                this.sqc_old = val;
                this.$emit('selectquery', this.selectquery[ item.field ]);
            },

            /**
             * [frosDateBlur fros日期处理]
             * @param  {[type]} val   [description]
             * @param  {[type]} field [description]
             * @return {[type]}       [description]
             */
            frosDateBlur( val, field ){
                this.outval[ field ] = val;
            },

            /**
             * [output 返回数据]
             * @return {[type]} [description]
             */
            output(){
                const _outval = {};

                for( let key in this.outval ){

                    const d = this.outval[ key ];

                    typeof d !== 'number' && key !== '_datetimerange' ?

                        _outval[ key ] = d.split(/\n|,|\r/g).filter( f => f ).join() :

                        key === '_datetimerange' && this.outval[ key ] ? (
                            _outval['startTime'] = this.$util.formatDate('yyyy-MM-dd hh:mm:ss', this.outval[ key ][0]),
                            _outval['endTime'] = this.$util.formatDate('yyyy-MM-dd hh:mm:ss', this.outval[ key ][1])
                        ) :

                        _outval[ key ] = d;
                }

                if( this.verify ){
                    this.$emit('getvalue', _outval);
                }
            },

            /**
             * [changeSearchTime 切换查询时长]
             * @param  {[type]} val [description]
             * @return {[type]}     [description]
             */
            changeSearchTime( val ){
                let time = this.$util.quickTime(val)
                this.outval = Object.assign({}, this.outval, time)          },
        },
        beforeDestroy(){

        }
    }
</script>
<style lang="scss">
    .component-filter {
        padding: 10px 0 10px 10px;
        position: relative;

        .filter-body {
            display: flex;

            &.off {
                height: 0;
                overflow: hidden;

                & + .toggle {
                    i { transform: rotate(90deg); }
                }
            }
        }

        .left {
            align-items: flex-start;
            display: flex;
            flex: 5;
            flex-wrap: wrap;
            justify-content: flex-start;

            .filter-row {
                height: calc(100% - 10px);
                margin: 0 10px 10px 0;
                // width: calc(50% - 10px);

                .filter-label { height: calc(100% - 13px); }
            }

            &-textarea {
                display: flex;
                flex-wrap: wrap;
                height: 100%;
            }

            &-other {
                display: flex;
                flex-wrap: wrap;
            }

            &-lang {
                width: 100%;
            }
        }

        .right {
            align-items: center;
            display: flex;
            flex: 1;
            justify-content: center;
            padding: 0 10px;

            button {
                margin-top: -10px;
                width: 80px;
            }
        }

        .filter{
            &-row {
                align-items: center;
                display: flex;
            }

            &-label {
                flex-shrink: 0;
                margin-right: 10px;
                overflow: hidden;
                text-align: right;
                text-overflow: ellipsis;
                width: 80px;
                white-space: nowrap;
            }
        }
        .clocker{
            align-items: center;
            display: flex;
            height: 30px;
            line-height: 30px;

            label, span {
                height: 30px;
                line-height: 30px;
            }

            .fros-form-item-center {
                position: relative;
                top: -1px;
            }

            .el-radio-button__inner {
                padding: 0 7px !important;
            }
        }
        .toggle {
            border: 1px solid rgba(224,231,237,1);
            border-radius: 5px 5px 0 0;
            border-bottom: none;
            bottom: 0;
            cursor: pointer;
            height: 12px;
            line-height: 12px;
            left: 50%;
            margin: 0 0 0 -32px;
            position: absolute;
            text-align: center;
            width: 64px;

            i {
                color: #E0E7ED;
                display: inline-block;
                font-size: 12px;
                transform: rotate(-90deg);
            }
        }
    }
</style>
<style lang="scss">
    .component-filter {

        .selectquery {
            display: flex;
            padding: 0 10px 0 0 ;
            width: 100%;

            .el-select {
                flex: 1;
            }

            .el-textarea {
                flex: 4;
            }

            textarea {
                height: 32px;
                line-height: 32px;
                margin: 0 0 0 10px;
                min-height: 32px !important;
                overflow: hidden;
                padding: 0 5px;
            }
        }
        .clocker{
            .el-radio-group {
                font-size: 0;
                margin-right: 10px;
            }
        }

        .el-input {
            height: 32px;
            width: 100%;

            .el-input__icon {
                line-height: 32px;
            }

            .el-input__inner {
                font-size: 12px;
                height: 32px;
                line-height: 32px;
                padding: 0 8px;
            }
        }

        .el-select {
            width: 100%;
        }

        .el-textarea
        {
            height: 100%;
            &__inner {
                height: inherit;
            }
        }
        .el-radio-button--mini .el-radio-button__inner{
            padding: 7px;
        }
    }
</style>
