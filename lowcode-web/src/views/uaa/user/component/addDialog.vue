<template>
  <div>
    <el-dialog v-model="isShowDialog" @open="onOpen" @close="onClose" :title="title">
      <el-form ref="uaa_user" :model="formData" :rules="rules" size="medium" label-width="90px">
        <el-form-item label="头像" prop="portrait">
          <el-upload ref="portrait" :file-list="portraitfileList" :before-upload="portraitBeforeUpload"
            list-type="picture-card" accept="image/*">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" :maxlength="30" clearable
            :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" :maxlength="100" clearable show-password
            :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="field105">
          <el-select v-model="formData.field105" placeholder="请选择角色" multiple clearable
            :style="{width: '100%'}">
            <el-option v-for="(item, index) in field105Options" :key="index" :label="item.label"
              :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" :maxlength="11" clearable
            :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" :maxlength="200" clearable
            :style="{width: '100%'}"></el-input>
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
        portrait: null,
        username: "admin",
        password: "199f1b99458e7938a78f70f2",
        field105: [1, 2],
        phone: undefined,
        email: undefined,
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        field105: [],
        phone: [],
        email: [],
      },
      field105Options: [{
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
      this.$refs['uaa_user'].resetFields()
    },
    open() {
      this.isShowDialog = true;
    },
    close() {
      this.isShowDialog = false;
    },
    handelConfirm() {
      this.$refs['uaa_user'].validate(valid => {
        if (!valid) return
        this.$request({
          url: '/uaa/user',
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
.el-upload__tip {
  line-height: 1.2;
}

</style>
