<template>
  <div>
    <el-dialog v-model="isShowDialog" @open="onOpen" @close="onClose" :title="title">
      <el-form ref="qa_answer" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="应答文本" prop="text">
          <el-input v-model="formData.text" type="textarea" placeholder="请输入多行文本应答文本"
            :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
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
        text: undefined,
      },
      rules: {
        text: [{
          required: true,
          message: '请输入多行文本应答文本',
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
      this.$refs['qa_answer'].resetFields()
    },
    open(row) {
      this.formData = row;
      this.isShowDialog = true;
    },
    close() {
      this.isShowDialog = false;
    },
    handelConfirm() {
      this.$refs['qa_answer'].validate(valid => {
        if (!valid) return
        this.$request({
          url: '/qa/answer/' + this.formData.id,
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
