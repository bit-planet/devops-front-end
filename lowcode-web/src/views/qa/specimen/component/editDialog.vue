<template>
  <div>
    <el-dialog v-model="isShowDialog" @open="onOpen" @close="onClose" :title="title">
      <el-form ref="qa_specimen" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="意图ID" prop="intentionId">
          <el-select v-model="formData.intentionId" placeholder="请选择意图ID" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in intentionIdOptions" :key="index" :label="item.label"
              :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="样本内容" prop="content">
          <el-input v-model="formData.content" placeholder="请输入样本内容" clearable :style="{width: '100%'}">
          </el-input>
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
        intentionId: undefined,
        content: undefined,
      },
      rules: {
        intentionId: [{
          required: true,
          message: '请选择意图ID',
          trigger: 'change'
        }],
        content: [{
          required: true,
          message: '请输入样本内容',
          trigger: 'blur'
        }],
      },
      intentionIdOptions: [{
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
      this.$refs['qa_specimen'].resetFields()
    },
    open(row) {
      this.formData = row;
      this.isShowDialog = true;
    },
    close() {
      this.isShowDialog = false;
    },
    handelConfirm() {
      this.$refs['qa_specimen'].validate(valid => {
        if (!valid) return
        this.$request({
          url: '/qa/specimen/' + this.formData.id,
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
