<template>
	<div class="dynamic-form-container">
		<el-card shadow="hover">
      <template #header>
          <el-row :gutter="10"  align="middle">
            <el-col :span="3">
              <span>选择数据库</span>
            </el-col>

            <el-col :span="9">
              <el-select v-model="value" placeholder="20.5.120.38/credit">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-link type="warning">开发中......</el-link>
            </el-col>
            <el-col :span="6" align="right">
              <el-button type="success">数据库配置</el-button>
            </el-col>

          </el-row>
      </template>

			<el-form :model="form" ref="formRulesOneRef" size="small" label-width="100px" class="mt35">
				<el-row :gutter="35">
					<el-col
						:xs="val.xs"
						:sm="val.sm"
						:md="val.md"
						:lg="val.md"
						:xl="val.xl"
						class="mb20"
						v-show="val.isShow"
						v-for="(val, key) in formData"
						:key="key"
					>
						<template v-if="val.type !== ''">
							<el-form-item
								:label="val.label"
								:prop="val.prop"
								:rules="[{ required: val.required, message: `${val.label}不能为空`, trigger: val.type === 'input' ? 'blur' : 'change' }]"
								v-if="val.type !== ''"
							>
								<el-input
									v-model="form[val.prop]"
									:placeholder="val.placeholder"
									clearable
									v-if="val.type === 'input'"
									style="width: 100%"
									:disabled="val.disabled"
								></el-input>
								<el-date-picker
									v-model="form[val.prop]"
									type="date"
									:placeholder="val.placeholder"
									v-else-if="val.type === 'date'"
									style="width: 100%"
									:disabled="val.disabled"
								>
								</el-date-picker>
								<el-select
									v-model="form[val.prop]"
									:placeholder="val.placeholder"
									v-else-if="val.type === 'select'"
									style="width: 100%"
									:disabled="val.disabled"
								>
									<el-option v-for="item in val.options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
								</el-select>
								<el-input
									type="textarea"
									v-model="form[val.prop]"
									:placeholder="val.placeholder"
									clearable
									v-if="val.type === 'textarea'"
									style="width: 100%"
									:disabled="val.disabled"
								></el-input>
							</el-form-item>
						</template>
						<template v-else>
							<el-row :gutter="25" v-for="(v, k) in form.list" :key="k">
								<el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" class="mb20">
									<el-form-item label="年度" :prop="`list[${k}].year`" :rules="[{ required: true, message: `字段不能为空`, trigger: 'blur' }]">
										<template #label>
											<el-button type="primary" icon="el-icon-plus" circle size="mini" @click="onAddRow" v-if="k === 0"></el-button>
											<el-button type="danger" icon="el-icon-delete" circle size="mini" @click="onDelRow(k)" v-else></el-button>
											<span class="ml10">文本</span>
										</template>
										<el-input v-model="form.list[k].year" style="width: 100%" placeholder="请输入"> </el-input>
									</el-form-item>
								</el-col>
								<el-col :xs="24" :sm="12" :md="5" :lg="5" :xl="5" class="mb20">
									<el-form-item label="url" :prop="`list[${k}].month`" :rules="[{ required: true, message: `字段长度`, trigger: 'blur' }]">
										<el-input v-model="form.list[k].month" style="width: 100%" placeholder="请输入"> </el-input>
									</el-form-item>
								</el-col>
								<el-col :xs="24" :sm="12" :md="5" :lg="5" :xl="5" class="mb20">
									<el-form-item label="路由参数" :prop="`list[${k}].day`" :rules="[{ required: true, message: `数据类型不能为空`, trigger: 'blur' }]">
										<el-input v-model="form.list[k].day" style="width: 100%" placeholder="请输入"> </el-input>
									</el-form-item>
								</el-col>

							</el-row>
						</template>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<el-row class="flex mt15">
			<div class="flex-margin">
				<el-button size="small" icon="el-icon-refresh-right" @click="onResetForm">预览sql</el-button>
				<el-button size="small" type="primary" icon="iconfont icon-shuxing" @click="onSubmitForm">提交审核</el-button>
			</div>
		</el-row>
	</div>
</template>

<script lang="ts">
import {toRefs, reactive, onMounted, getCurrentInstance, ref} from 'vue';
import { formData } from './mock';
export default {
	name: 'pagesDynamicForm',
	setup() {
		const { proxy } = getCurrentInstance() as any;
		const state = reactive({
			formData,
			form: {
				name: '',
				email: '',
				autograph: '',
				occupation: '',
				list: [
					{
						year: '',
						month: '',
						day: '',
            ext:''
					},
				],
				remarks: '',
			},
		});
		// 新增行
		const onAddRow = () => {
			state.form.list.push({
				year: '',
				month: '',
				day: '',
			});
		};
		// 删除行
		const onDelRow = (k) => {
			state.form.list.splice(k, 1);
		};
		// 表单验证
		const onSubmitForm = () => {
			proxy.$refs.formRulesOneRef.validate((valid) => {
				if (valid) {
					proxy.$message.success('验证成功');
				} else {
					return false;
				}
			});
		};
		// 重置表单
		const onResetForm = () => {
			proxy.$refs.formRulesOneRef.resetFields();
		};
		// 页面加载时
		onMounted(() => {});
		return {
			onAddRow,
			onDelRow,
			onSubmitForm,
			onResetForm,
			...toRefs(state),

      options: ref([
        {
          value: 'credit',
          label: 'credit',
        },
        {
          value: 'Option2',
          label: 'Option2',
        },
        {
          value: 'Option3',
          label: 'Option3',
        },
        {
          value: 'Option4',
          label: 'Option4',
        },
        {
          value: 'Option5',
          label: 'Option5',
        },
      ])
		};
	},
};
</script>
