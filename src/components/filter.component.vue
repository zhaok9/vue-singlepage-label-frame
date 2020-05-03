<template>
    <div class="component-filter">
        <div class="left">
            <template v-for="item of configs.filter( f => f.type == 'textarea')">
                <div class="filter-row">
                    <el-tooltip v-if="$u.strlen( $t(item.label) ) > 16" class="item" effect="dark" :content="$t(item.label)" placement="top">
                        <span class="filter-label">
                            {{ $t(item.label) }}
                        </span>
                    </el-tooltip>
                    <span v-else class="filter-label">
                        {{ $t(item.label) }}
                    </span>

                     <!-- 文本域 -->
                    <el-input
                        v-model="outval[ item.key ]"
                        type="textarea"
                        :placeholder="$t( item.placeholder )"
                        :disabled="item.disabled"
                        :readonly="item.readonly">
                    </el-input>
                </div>
            </template>
        </div>

        <div class="center">
            <template v-for="item of configs.filter( f => f.type !='textarea' )">
                <div class="filter-row">
                    <el-tooltip v-if="$u.strlen( $t(item.label) ) > 16" class="item" effect="dark" :content="$t(item.label)" placement="top">
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
                        v-model="outval[ item.key ]"
                        :placeholder="$t( item.placeholder) + $t(item.label)"
                        :disabled="item.disabled"
                        :readonly="item.readonly">
                    </el-input>

                    <!-- 普通下拉框 -->
                    <el-select
                        v-if="item.type == 'select'"
                        v-model="outval[ item.key ]"
                        :placeholder="$t( item.placeholder ) + $t(item.label)"
                        :disabled="item.disabled">
                        <el-option
                            v-for="item in (typeof item.data === 'string' ? STATIC_SOURCE[ item.data ] : item.data )"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>

                    <!-- 远程搜索拉 -->
                    <el-select
                        v-if="item.type == 'remoteselect'"
                        v-model="outval[ item.key ]"
                        filterable
                        remote
                        :disabled="item.disabled"
                        :placeholder="$t( item.placeholder )"
                        :remote-method="remoteMethod"
                        :loading="loading">
                        <el-option
                            v-for="item in remotelist"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </template>
        </div>

        <div class="right">
            <el-button size="small" type="primary" @click="$emit('getvalue', outval)">查询</el-button>
            <el-button size="small" @click="reset">重置</el-button>
        </div>
    </div>
</template>
<script>
    import { mapMutations, mapState } from "vuex";
    export default {
        name: "ComponentFilter",
        data() {
            return {
                loading: false,
                configs: [], // 筛选配置
                outval: {}, // 返回数据
                remotelist: [], // 远程搜索下拉数据源
            }
        },
        props: ["source"],
        watch: {
        },
        computed: {
            ...mapState(["STATIC_SOURCE"]),
        },
        created(){},
        mounted(){
            this.configs = this.source;
            this.defaultValue();
        },
        methods: {
            ...mapMutations([]),

            reset(){
                for( let key in this.outval ){
                    this.outval[ key ]= '';
                }
            },

            /**
             * [defaultValue 设置默认值]
             * @return {[type]} [description]
             */
            defaultValue(){
                this.configs.forEach( c => {
                    switch (c.type) {
                        case 'input':
                        case 'select':
                        case 'remoteselect':
                        case 'textarea': return this.$set( this.outval, c.key, c.value || '');
                    }
                });
            },

            /**
             * [remoteMethod 远程搜索方法]
             * @param  {[type]} query [description]
             * @return {[type]}       [description]
             */
            remoteMethod(query){
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        this.remotelist = [
                            { label: '漩涡鸣人', value: 'xwmr' },
                            { label: '宇智波佐助', value: 'yzbzz' },
                        ];
                    }, 200);
                } else {
                    this.remotelist = [];
                }
            }
        },
        beforeDestroy(){

        }
    }
</script>
<style lang="scss">
    .component-filter {
        display: flex;
        padding: 20px 0 0 20px;

        .left {
            align-items: flex-start;
            display: flex;
            flex: 2;
            justify-content: flex-start;
            .filter-row {
                height: calc(100% - 20px);
                width: 100%;

                .filter-label { height: 87%; }
            }
        }

        .center {
            display: flex;
            flex-wrap: wrap;
            flex: 3;

            .filter-row { width: 50%; }
        }

        .right {
            align-items: center;
            display: flex;
            flex: 1;
            justify-content: center;
        }

        .filter{
            &-row {
                align-items: center;
                display: flex;
                margin-bottom: 20px;
                // width: 350px;
            }

            &-label {
                margin-right: 10px;
                overflow: hidden;
                text-align: right;
                text-overflow: ellipsis;
                width: 90px;
                white-space: nowrap;
            }
        }
    }
</style>
<style lang="scss">
    .component-filter {
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
    }
</style>
