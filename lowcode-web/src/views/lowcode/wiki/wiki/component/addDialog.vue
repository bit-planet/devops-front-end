<template>
  <div>
    <el-dialog v-model="isShowDialog" @open="onOpen" @close="onClose" :title="title">
      <el-form ref="lcp_wiki" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="wiki分类" prop="classificationId">
          <el-cascader :options="formData.topParent" :show-all-levels="false" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入单行文本名称" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input v-model="formData.introduction" type="textarea" placeholder="请输入简介"
            :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="对谁可见" prop="privacy">
          <el-radio-group v-model="formData.privacy" size="medium">
            <el-radio v-for="(item, index) in privacyOptions" :key="index" :label="item.value"
              :disabled="item.disabled">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="允许协同" prop="allowCoordination" required>
          <el-switch v-model="formData.allowCoordination"></el-switch>
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
        classificationId:undefined,
        name: undefined,
        introduction: undefined,
        privacy: 1,
        allowCoordination: false,
        topParent:[
        ],
      },
      rules: {
        name: [{
          required: true,
          message: '请输入单行文本名称',
          trigger: 'blur'
        }],
        introduction: [{
          required: true,
          message: '请输入简介',
          trigger: 'blur'
        }],
        privacy: [{
          required: true,
          message: '对谁可见不能为空',
          trigger: 'change'
        }],
      },

      privacyOptions: [{
        "label": "公开",
        "value": 1
      }, {
        "label": "仅自己",
        "value": 2
      }],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen() {
      let self = this;
      // 清空
      self.topParent = [];
      this.$request({
        url: '/lowcode/wiki/wikiClassification/page',
        method: 'get',
        param: {size:100},
      }).then(res => {
        console.log(res.data);
        let arra = [];
        res.data.records.forEach(function (item) {
          if (item.parentId == 0) {
            arra.push({"label":item.classificationName,"value":item.id,children:[]});
          } else {
            arra.forEach(function (v) {
              if (v.value == item.parentId) {
                v.children.push({"label":item.classificationName,"value":item.id});
              }
            })
          }
        });
        res.data.records.forEach(function (item) {
          if (item.parentId > 0) {
            arra.forEach(function (v) {
              if (v.value == item.parentId) {
                v.children.push({"label":item.classificationName,"value":item.id});
              }
            })
          }
        });
        self.formData.topParent = arra;
        console.log(self.formData.topParent)
      }).catch(res => {
        this.$ElMessage.error("请求出错");
        console.log(res);
      });
    },
    onClose() {
      this.$refs['lcp_wiki'].resetFields()
    },
    open() {
      this.isShowDialog = true;
    },
    close() {
      this.isShowDialog = false;
    },
    handelConfirm() {
      this.$refs['lcp_wiki'].validate(valid => {
        if (!valid) return
        $request({
          url: '/lowcode/wiki/wiki',
          method: 'post',
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
