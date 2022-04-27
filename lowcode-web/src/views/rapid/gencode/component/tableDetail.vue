<template>
    <div class="system-menu-container">
        <el-dialog title="新增数据源连接" v-model="isShowDialog" width="700px">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="columnName" label="列名" width="180" />
                <el-table-column prop="type" label="类型" width="180" />
                <el-table-column prop="comment" label="注释" />
                <el-table-column prop="notnull" label="非空" />
            </el-table>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {getCurrentInstance, reactive, toRefs} from 'vue';
    import IconSelector from '/@/components/iconSelector/index.vue';
    import {save} from "/@/api/dbDesign/datasource";
    import { setBackEndControlRefreshRoutes } from "/@/router/backEnd";
    import {useRoute} from "vue-router";
    import {refreshCurrentTag} from "/@/utils/tagsViews";
    import {tableDetail} from "/@/api/dbDesign/rapid/gencode";
    export default {
        name: 'systemAddMenu',
        components: { IconSelector },
        setup() {
            var {proxy} = getCurrentInstance() as any;
            const route = useRoute();
            const state = reactive({
                isShowDialog: false,
                /**
                 * 参数请参考 `/src/router/route.ts` 中的 `dynamicRoutes` 路由菜单格式（请注意参数类型！）
                 * 受到 `element plus` 类型 `string/number/object` 影响，不可使用 `:value="true"`
                 * 的写法，所以传值到后台时，需要转换成布尔值，否则页面可能出现玄学。
                 * 路由权限标识为数组格式，基本都需要自行转换类型
                 */
                tableData: [{
                    columnName: '',
                    type: '',
                    comment: '',
                    notnull: '',
                }],
            });
            // 打开弹窗
            const openDialog = (databaseId :any,row?: object) => {
                console.log(databaseId);
                console.log("--------------------");
                console.log(row);
                initTable(databaseId, row.tableName)
                state.isShowDialog = true;
            };
            // 关闭弹窗
            const closeDialog = (row?: object) => {
                console.log(row);
                state.isShowDialog = false;
            };


            // 是否内嵌下拉改变
            const onSelectIframeChange = () => {
                // if (state.ruleForm.meta.isIframe === 'true') {
                // 	state.ruleForm.isLink = 'true';
                // } else {
                // 	state.ruleForm.isLink = '';
                // }
            };
            const initTable = (databaseId:any,tableName:string) => {
                tableDetail(databaseId,tableName).then(res => {
                    state.tableData = res.data
                }).catch(res => {

                });
            }
            return {
                openDialog,
                closeDialog,
                onSelectIframeChange,
                ...toRefs(state),
            };
        },
    };
</script>
