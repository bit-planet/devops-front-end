<template>
  <div>
    <el-dialog v-model="isShowDialog" @open="onOpen" @close="onClose" title="Dialog Titile">
      <el-row :gutter="15">
        <el-form ref="lcp_product_info" :model="formData" :rules="rules" size="medium" label-width="115px">
          <el-col :span="12">
            <el-form-item label="公司/组织" prop="companyName">
              <el-input v-model="formData.companyName" placeholder="例如：com.tansun" :maxlength="30" clearable
                :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品/工程组" prop="productName">
              <el-input v-model="formData.productName" placeholder="例如：credit" :maxlength="30" clearable
                :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="初始版本号" prop="version">
              <el-input v-model="formData.version" placeholder="例如：1.0.0" :maxlength="20" clearable
                :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品描述" prop="description">
              <el-input v-model="formData.description" type="textarea" placeholder="请输入产品描述" :maxlength="200"
                :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
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
      formData: {
        companyName: undefined,
        productName: undefined,
        version: "",
        description: undefined,
      },
      rules: {
        companyName: [{
          required: true,
          message: '例如：com.tansun',
          trigger: 'blur'
        }],
        productName: [{
          required: true,
          message: '例如：credit',
          trigger: 'blur'
        }],
        version: [{
          required: true,
          message: '例如：1.0.0',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '请输入产品描述',
          trigger: 'blur'
        }],
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
      this.$refs['lcp_product_info'].resetFields()
    },
    open(row) {
      this.formData = row;
      this.isShowDialog = true;
    },
    close() {
      this.isShowDialog = false;
    },
    handelConfirm() {
      this.$refs['lcp_product_info'].validate(valid => {
        if (!valid) return
        this.$request({
          url: '/lowcode/initialconfig/productInfo/' + this.formData.id,
          method: 'put',
          data: this.formData,
        }).then(res => {
          this.close();
          this.$parent.initTableData();
        }).catch(res => {
          this.$ElMessage.error("请求出错");
          console.log(res);
        });
      })
    },
  }
}

</script>
<style>
</style>
