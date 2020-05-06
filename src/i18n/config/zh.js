const zh = {
    // start 组件国际化 =========================
        comp: {
            // 导航组件
            navigation: {
                template: '组件实例',
                home: '首页'
            },

            // 筛选组件
            filter: {
                placeholder: {
                    input: '请输入',
                    select: '请选择',
                    remoteselect: '请输入搜索关键字',
                    textarea: '请输入搜索内容, 多个换行或以","隔开'
                },
                reset: '重置',
                search: '查询'
            },

            // 表格组件
            table: {
                number: '序号',
                operating: '操作'
            }
        },
    // end 组件国际化 ===========================

    // start 静态资源国际化 =========================
        static: {
            sex: {
                man: '男',
                woman: '女'
            }
        },
    // end 静态资源国际化 =========================

    // start 页面国际化 =========================
        template: {
            filter: {
                name: '姓名',
                sex: '性别',
                grade: '年级',
                studentid: '学号'
            },

            table: {
                columns: {
                    name: '姓名',
                    sex: '性别'
                },
                btns: {
                    test: '测试按钮',
                    del: '删除',
                    edit: '编辑',
                    detail: '查看详情'
                }
            }
        }
    // end 页面国际化 =========================
};

export default zh;