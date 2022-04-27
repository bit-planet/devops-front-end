<template>
  <div>
    <el-dialog v-model="isShowDialog" @open="onOpen" @close="onClose" :title="title">
      <el-form ref="qa_intention" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="识别码" prop="sn">
          <el-input v-model="formData.sn" placeholder="请输入识别码" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" placeholder="请输入描述"
            :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="回复方式" prop="answerType">
          <el-select v-model="formData.answerType" placeholder="请选择回复方式" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in answerTypeOptions" :key="index" :label="item.label"
              :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status" required>
          <el-switch v-model="formData.status"></el-switch>
        </el-form-item>
      </el-form>
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
  props: ['title'],
  data() {
    return {
      isShowDialog: false,
      formData: {
        sn: undefined,
        description: undefined,
        answerType: undefined,
        status: false,
      },
      rules: {
        sn: [{
          required: true,
          message: '请输入识别码',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '请输入描述',
          trigger: 'blur'
        }],
        answerType: [{
          required: true,
          message: '请选择回复方式',
          trigger: 'change'
        }],
      },
      answerTypeOptions: [{
        "label": "选项一",
        "value": 1
      }, {
        "label": "选项二",
        "value": 2
      }],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
      this.$refs['qa_intention'].resetFields()
    },
    open(row) {
      this.formData = row;
      this.isShowDialog = true;
    },
    close() {
      this.isShowDialog = false;
    },
    handelConfirm() {
      this.$refs['qa_intention'].validate(valid => {
        if (!valid) return
        this.$request({
          url: '/qa/intention/' + this.formData.id,
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
