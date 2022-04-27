<template>
  <div>
    <el-dialog v-model="isShowDialog" @open="onOpen" @close="onClose" :title="title">
      <el-form ref="lcp_wiki_classification" :model="formData" :rules="rules" size="medium"
        label-width="100px">
        <el-form-item label="父级分类" prop="field110">
          <el-select v-model="formData.parentId" placeholder="请选择父级分类" clearable :style="{width: '100%'}">
            <el-option key="0" label="顶级分类" value="0" ></el-option>
            <el-option v-for="(item, index) in topParent" :key="index" :label="item.label"
              :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名" prop="classificationName">
          <el-input v-model="formData.classificationName" placeholder="请输入分类名" clearable
            :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="分类介绍" prop="introduction">
          <el-input v-model="formData.introduction" type="textarea" placeholder="请输入分类介绍" :maxlength="500"
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
        parentId: "0",
        classificationName: undefined,
        introduction: undefined,
      },
      rules: {
        topParent: [],
        classificationName: [{
          required: true,
          message: '请输入分类名',
          trigger: 'blur'
        }],
        introduction: [{
          required: true,
          message: '请输入分类介绍',
          trigger: 'blur'
        }],
      },
      topParent: [],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen() {

    },
    onClose() {
      this.$refs['lcp_wiki_classification'].resetFields()
    },
    open(row) {

      let self = this;
      // 清空
      self.topParent = [];
      this.$request({
        url: '/lowcode/wiki/wikiClassification/page',
        method: 'get',
        param: {size:100,parentId:0},
      }).then(res => {
        console.log(res.data)
        res.data.records.forEach(function (item) {
          let option = {"label":item.classificationName,"value":item.id};
          self.topParent.push(option);
        });
        self.formData = row;
        self.isShowDialog = true;
      }).catch(res => {
        this.$ElMessage.error("请求出错");
        console.log(res);
      });

    },
    close() {
      this.isShowDialog = false;
    },
    handelConfirm() {
      this.$refs['lcp_wiki_classification'].validate(valid => {
        if (!valid) return
        this.$request({
          url: '/lowcode/wiki/wikiClassification/' + this.formData.id,
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
