<template>
  <div>
    <el-dialog v-model="isShowDialog" @open="onOpen" @close="onClose" :title="title">
      <el-form ref="sns_vote_topic" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="主题名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入单行文本主题名称" :maxlength="20" clearable
            :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="话题下讨论数量" prop="discussionCount">
          <el-input-number v-model="formData.discussionCount" placeholder="话题下讨论数量" :step='1'>
          </el-input-number>
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
        name: undefined,
        discussionCount: undefined,
      },
      rules: {
        name: [{
          required: true,
          message: '请输入单行文本主题名称',
          trigger: 'blur'
        }],
        discussionCount: [{
          required: true,
          message: '话题下讨论数量',
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
      this.$refs['sns_vote_topic'].resetFields()
    },
    open(row) {
      this.formData = row;
      this.isShowDialog = true;
    },
    close() {
      this.isShowDialog = false;
    },
    handelConfirm() {
      this.$refs['sns_vote_topic'].validate(valid => {
        if (!valid) return
        this.$request({
          url: '/vote/topic/' + this.formData.id,
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
