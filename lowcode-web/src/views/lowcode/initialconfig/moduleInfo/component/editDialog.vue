<template>
  <div>
    <el-dialog v-model="isShowDialog" @open="onOpen" @close="onClose" title="Dialog Titile">
      <el-row :gutter="15">
        <el-form ref="lcp_module_info" :model="formData" :rules="rules" size="medium" label-width="115px">
          <el-col :span="12">
            <el-form-item label="产品ID" prop="productId">
              <el-select v-model="formData.productId" placeholder="请选择产品ID" clearable
                :style="{width: '100%'}">
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模块名" prop="moduleName">
              <el-input v-model="formData.moduleName" placeholder="请输入模块名" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模块描述" prop="description">
              <el-input v-model="formData.description" placeholder="请输入单行文本模块描述" clearable
                :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="后端Git目录" prop="backGitDir">
              <el-cascader v-model="formDataTemp.backGitDir" :options="backGitDirOptions" :props="backGitDirProps"
                :style="{width: '100%'}" placeholder="请选择后端Git目录" clearable></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="后端模块目录" prop="backModuleDir">
              <el-cascader v-model="formDataTemp.backModuleDir" :options="backModuleDirOptions"
                :props="backModuleDirProps" :style="{width: '100%'}" placeholder="请选择后端模块目录" clearable>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="前端Git目录" prop="frontGitDir">
              <el-cascader v-model="formDataTemp.frontGitDir" :options="frontGitDirOptions"
                :props="frontGitDirProps" :style="{width: '100%'}" placeholder="请选择前端Git目录" clearable>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="前端模块目录" prop="frontModuleDir">
              <el-cascader v-model="formDataTemp.frontModuleDir" :options="frontModuleDirOptions"
                :props="frontModuleDirProps" :style="{width: '100%'}" placeholder="请选择前端模块目录" clearable>
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close" size="small">取消</el-button>
          <el-button type="primary" @click="handelConfirm" size="small">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  components: {},
  props: [],
  data() {
    return {
      isShowDialog: false,
      formDataTemp: {

      },
      formData: {
        productId: undefined,
        moduleName: undefined,
        description: undefined,
        backGitDir: [1],
        backModuleDir: [1],
        frontGitDir: [null],
        frontModuleDir: [],
      },
      rules: {
        productId: [{
          required: true,
          message: '请选择产品ID',
          trigger: 'change'
        }],
        moduleName: [{
          required: true,
          message: '请输入模块名',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '请输入单行文本模块描述',
          trigger: 'blur'
        }],
        // backGitDir: [{
        //   required: true,
        //   type: 'array',
        //   message: '请至少选择一个后端Git目录',
        //   trigger: 'change'
        // }],
        // backModuleDir: [{
        //   required: true,
        //   type: 'array',
        //   message: '请至少选择一个后端模块目录',
        //   trigger: 'change'
        // }],
        // frontGitDir: [{
        //   required: true,
        //   type: 'array',
        //   message: '请至少选择一个前端Git目录',
        //   trigger: 'change'
        // }],
        // frontModuleDir: [{
        //   required: true,
        //   type: 'array',
        //   message: '请至少选择一个前端模块目录',
        //   trigger: 'change'
        // }],
      },
      backGitDirOptions: [],
      backModuleDirOptions: [],
      frontGitDirOptions: [],
      frontModuleDirOptions: [],
      backGitDirProps: {
        "multiple": false,
        "label": "name",
        "value": "file",
        "children": "children",
        "checkStrictly": true
      },
      backModuleDirProps: {
        "multiple": false,
        "label": "name",
        "value": "name",
        "children": "children",
        "checkStrictly": true
      },
      frontGitDirProps: {
        "multiple": false,
        "label": "name",
        "value": "file",
        "children": "children",
        "checkStrictly": true
      },
      frontModuleDirProps: {
        "multiple": false,
        "label": "name",
        "value": "name",
        "children": "children",
        "checkStrictly": true
      },
    }
  },
  computed: {},
  watch: {
    'formDataTemp.backGitDir': {
      handler(value) {
        console.log(value)
        if (value) {
          this.formData.backGitDir = value[value.length - 1];
          // 更新
          this.$request({
            url: '/lowcode/initialconfig/moduleInfo/merge/config/dirs',
            method: 'get',
            params: {rootDir: this.formData.backGitDir},
          }).then(resp => {
            this.backModuleDirOptions = resp.data.children;
          }).catch(res => {
            this.$ElMessage.error("请求出错");
            console.log(res);
          });
        } else {
          this.formData.backGitDir = undefined;
        }
      }
    },
    'formDataTemp.backModuleDir': {
      handler(value) {
        this.formData.backModuleDir = "/" + value.join("/");
      },
    },
    'formDataTemp.frontGitDir': {
      handler(value) {
        console.log(value)
        if (value) {
          this.formData.frontGitDir = value[value.length - 1];
          // 更新
          this.$request({
            url: '/lowcode/initialconfig/moduleInfo/merge/config/dirs',
            method: 'get',
            params: {rootDir: this.formData.frontGitDir},
          }).then(resp => {
            this.frontModuleDirOptions = resp.data.children;
          }).catch(res => {
            this.$ElMessage.error("请求出错");
            console.log(res);
          });
        } else {
          this.formData.frontGitDir = undefined;
        }
      }
    },
    'formDataTemp.frontModuleDir': {
      handler(value) {
        this.formData.frontModuleDir = "/" + value.join("/");
      }
    },
  },
  created() {
    this.getBackGitDirOptions();
    this.getFrontGitDirOptions();
  },
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
      this.$refs['lcp_module_info'].resetFields()
    },
    open(row) {
      this.formData = row;
      this.isShowDialog = true;
    },
    close() {
      this.isShowDialog = false;
    },
    handelConfirm() {
      this.$refs['lcp_module_info'].validate(valid => {
        if (!valid) return
        this.$request({
          url: '/lowcode/initialconfig/moduleInfo/' + this.formData.id,
          method: 'put',
          data: this.formData,
        }).then(res => {
          this.close();
          this.$parent.initTableData();
          console.log(res)
        }).catch(res => {
          this.$ElMessage.error("请求出错");
          console.log(res);
        });
      })
    },
    getBackGitDirOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      this.$request({
        method: 'get',
        url: '/lowcode/initialconfig/moduleInfo/merge/config/dirs'
      }).then(resp => {
        this.backGitDirOptions = resp.data.children;
      })
    },
    getFrontGitDirOptions() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      this.$request({
        method: 'get',
        url: '/lowcode/initialconfig/moduleInfo/merge/config/dirs'
      }).then(resp => {
        this.frontGitDirOptions = resp.data.children;
      })
    },
  }
}

</script>
<style>
</style>
