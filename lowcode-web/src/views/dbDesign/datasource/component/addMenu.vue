<template>
	<div class="system-menu-container">
		<el-dialog title="新增数据源连接" v-model="isShowDialog" width="500px">
			<el-form :model="ruleForm" size="small" label-width="120px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="连接名称">
							<el-input v-model="datasource.name" placeholder="填写名称" clearable></el-input>
						</el-form-item>
					</el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="数据库类型">
							<el-select v-model="datasource.type" placeholder="选择数据库" clearable class="w100">
								<el-option label="postgresql" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="主机">
              <el-input v-model="datasource.host"  placeholder="主机IP / localhost" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="端口号">
              <el-input v-model="datasource.port" placeholder="端口号" clearable></el-input>
            </el-form-item>
          </el-col>

		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
			<el-form-item label="数据库">
				<el-input v-model="datasource.database" placeholder="默认数据库" clearable></el-input>
			</el-form-item>
		</el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户名">
              <el-input v-model="datasource.username"  placeholder="默认数据库名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="密码">
              <el-input v-model="datasource.password" placeholder="数据库密码" clearable></el-input>
            </el-form-item>
          </el-col>

				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="small">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="small">保 存</el-button>
				</span>
			</template>
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
			datasource: {
				name: '', // 连接名称
				type: '', // 数据库类型
				host: '', // 主机
				port: '', // 端口号
				username: '', // 用户名
				password: '', // 密码
			},
		});
		// 打开弹窗
		const openDialog = (row?: object) => {
			console.log(row);
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
		// 取消
		const onCancel = () => {
			closeDialog();
			initForm();
		};
		// 新增
		const onSubmit = () => {
      save(state.datasource).then((res)=>{
        closeDialog(); // 关闭弹窗
        refreshCurrentTag(proxy,route);// 刷新当前页
      }).catch((res)=>{
        console.log(res);
      });

		};
		// 表单初始化，方法：`resetFields()` 无法使用
		const initForm = () => {

		};
		return {
			openDialog,
			closeDialog,
			onSelectIframeChange,
			onCancel,
			onSubmit,
			...toRefs(state),
		};
	},
};
</script>
