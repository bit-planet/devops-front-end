<template>
  <div>
    <el-drawer v-bind="$attrs" v-on="$listeners" @opened="onOpen" @close="onClose">
      <div style="height:100%;padding: 5px 20px">
        <el-row style="margin-top: 5px">
          <el-form r :rules="rules"
                   :model="projInfo" label-width="85px"
                   style="width: 100%;"
                   align="left" label-position="left"
                   :gutter="1" ref="groupForm"
                   size="medium"

          >
            <el-row :gutter="5" >
              <el-col :span="4" align="left">
                <el-select v-model="dataSourceSelect.value" @change="selectDataSource" placeholder="">
                  <el-option
                    v-for="item in dataSourceSelect.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品：" prop="product">
                  <el-select v-model="genForm.product" placeholder="选择产品" clearable
                             value-key="id"
                             :style="{width: '100%'}" @change="onProductChange" >
                    <el-option
                      v-for="item in productInfos"
                      :key="item.id"
                      :label="item.companyName+'.'+item.productName"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item label="模块名：" prop="module">
                  <el-select v-model="genForm.module"  placeholder="选择模块" clearable
                             value-key="id"
                             :style="{width: '100%'}" @change="onModuleChange">
                    <el-option
                      v-for="item in moduleInfos"
                      :key="item.id"
                      :label="item.moduleName"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="子模块：" prop="subModuleName">
                  <el-input v-model="projInfo.subModuleName" placeholder="例:datasource"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="版本号：" prop="version">
                  <el-input v-model="projInfo.version" placeholder="例：1.0.0.RELEASE"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5" style="margin-top: 5px">

              <el-col :span="10">
                <el-form-item  label="表注释：" prop="description">
                  <el-input v-model="projInfo.description" placeholder="必填项" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="去表前缀：">
                  <el-tag
                    v-for="tag in projInfo.tablePrefix"
                    :key="tag"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input style="max-width: 70px"
                            v-if="inputVisible"
                            ref="saveTagInput"
                            v-model="inputValue"
                            class="input-new-tag"
                            size="mini"
                            @keyup.enter="handleInputConfirm"
                            @blur="handleInputConfirm"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput"
                  >+ 添加</el-button
                  >
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item label="覆盖文件：">
                  <el-switch
                    v-model="projInfo.override"
                    active-color="#13ce66">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="6" align="right">
                <el-button type="primary" @click="previewBackendCode">执行SQL</el-button>
                <el-button type="primary" @click="installCode">安装代码</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
        <el-row style="height:100%;overflow:auto">
          <el-col :md="24" :lg="24" class="left-editor">
            <div class="setting" title="资源引用" @click="showResource">
              <el-badge :is-dot="!!resources.length" class="item">
                <i class="el-icon-setting" />
              </el-badge>
            </div>
            <el-tabs v-model="activeTab" type="card" class="editor-tabs">
              <el-tab-pane name="list">
                <span slot="label">
                  <i v-if="activeTab==='list'" class="el-icon-edit" />
                  <i v-else class="el-icon-document" />
                  list.vue
                </span>
              </el-tab-pane>

              <el-tab-pane name="add">
                <span slot="label">
                  <i v-if="activeTab==='add'" class="el-icon-edit" />
                  <i v-else class="el-icon-document" />
                  add.vue
                </span>
              </el-tab-pane>

              <el-tab-pane name="edit">
                <span slot="label">
                  <i v-if="activeTab==='edit'" class="el-icon-edit" />
                  <i v-else class="el-icon-document" />
                  edit.vue
                </span>
              </el-tab-pane>

              <el-tab-pane name="sql">
                <span slot="label">
                  <i v-if="activeTab==='sql'" class="el-icon-edit" />
                  <i v-else class="el-icon-document" />
                  sql
                </span>
              </el-tab-pane>

            </el-tabs>
            <div v-show="activeTab==='list'" id="editorList" class="tab-editor" />
            <div v-show="activeTab==='add'" id="editorAdd" class="tab-editor" />
            <div v-show="activeTab==='edit'" id="editorEdit" class="tab-editor" />
            <div v-show="activeTab==='sql'" id="editorSql" class="tab-editor" />
          </el-col>
        </el-row>
      </div>
    </el-drawer>
    <resource-dialog
      :visible.sync="resourceVisible"
      :origin-resource="resources"
      @save="setResource"
    />
  </div>
</template>
<script>
import { parse } from '@babel/parser'
import ClipboardJS from 'clipboard'
import { saveAs } from 'file-saver'
import {
  makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/components/generator/html'
import { makeUpJs } from '@/components/generator/js'
import { makeUpEditJs } from '@/components/generator/editJs'
import { makeUpCss } from '@/components/generator/css'
import { exportDefault, beautifierConf, titleCase } from '@/utils/index'
import ResourceDialog from './ResourceDialog'
import loadMonaco from '@/utils/loadMonaco'
import loadBeautifier from '@/utils/loadBeautifier'
import JSONBIG from 'json-bigint';
import request from '@/utils/request'

const editorObj = {

}
let sqlValue;

const mode = {
  html: 'html',
  add: 'html',
  edit: 'html',
  list: 'html',
  js: 'javascript',
  css: 'css',
  pgsql: 'pgsql',
  java:'java'
}
let beautifier
let monaco

export default {
  components: { ResourceDialog },
  props: ['formData', 'generateConf'],
  data() {
    return {
      activeTab: 'add',
      htmlCode: '',
      jsCode: '',
      cssCode: '',
      codeFrame: '',
      isIframeLoaded: false,
      isInitcode: false, // 保证open后两个异步只执行一次runcode
      isRefreshCode: false, // 每次打开都需要重新刷新代码
      resourceVisible: false,
      scripts: [],
      links: [],
      monaco: null,
      dataSourceSelect: {
        value:'',
        options: [{label:'',value:''}]
      },
      productInfos:[], // 产品列表
      moduleInfos:[], // 模块列表
      moduleId:undefined,
      genForm: {
        product:{},
        module:{},
      },
      projInfo:{
        companyName:'com.tansun',
        productName:'credit',
        moduleName:'',
        subModuleName:'',
        version:'1.0.0.RELEASE',
        description:'',
        tablePrefix: [],
        override: false,
      },
      rules: {
        companyName: [
          {
            required: true,
            message: '公司名不能为空',
            trigger: 'blur',
          }
        ],
        productName: [
          {
            required: true,
            message: '项目/产品名不能为空',
            trigger: 'blur',
          }
        ],
        moduleName: [
          {
            required: true,
            message: '模块名不能为空',
            trigger: 'blur',
          }
        ],

        version: [
          {
            required: true,
            message: '版本号不能为空',
            trigger: 'blur',
          }
        ],

        description:[
          {
            required: true,
            message: '描述不能为空',
            trigger: 'blur',
          }
        ]
      },
      inputVisible: false,
      inputValue: '',
    }
  },
  computed: {
    resources() {
      return this.scripts.concat(this.links)
    }
  },
  watch: {
    projInfo: {
      handler(val) {
        const { type } = this.generateConf
        this.htmlCode = makeUpHtml(this.formData, type)
        this.jsCode = makeUpJs(this.formData,this.projInfo,type)
        this.cssCode = makeUpCss(this.formData)
        this.editJsCode = makeUpEditJs(this.formData,this.projInfo, type)
        loadBeautifier(btf => {
          beautifier = btf
          this.htmlCode = beautifier.html(this.htmlCode, beautifierConf.html)
          this.jsCode = beautifier.js(this.jsCode, beautifierConf.js)
          this.cssCode = beautifier.css(this.cssCode, beautifierConf.html)
          this.editJsCode = beautifier.js(this.editJsCode, beautifierConf.js)
          const addVue = beautifier.html(vueTemplate(this.htmlCode) + vueScript(this.jsCode) + cssStyle(this.cssCode),
            beautifierConf.html)
          this.setEditorValue('editorAdd', 'add', addVue)
          // 编辑页面
          const editVue = beautifier.html(vueTemplate(this.htmlCode) + vueScript(this.editJsCode) + cssStyle(this.cssCode),
            beautifierConf.html)
          this.setEditorValue('editorEdit', 'edit', editVue)
        })
        // 为sql追加描述
        let appendDescription = sqlValue + `\nCOMMENT ON TABLE ${this.formData.formRef} IS '${this.projInfo.description}'`;
        this.setEditorValue('editorSql', 'pgsql', appendDescription)
      },
      deep:true
    }
  },
  created() {

  },
  mounted() {


  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.preventDefaultSave)
  },
  methods: {
    preventDefaultSave(e) {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
      }
    },
    onOpen() {
      // 数据源信息
      request({
        url: "/api/lowcode/datasourceInfo/list",
        method: "get",
        data : {}
      }).then((resp) => {
        const resData = resp.data;
        let  options = [];
        for (let dataKey in resData) {
          let resDatum = resData[dataKey];
          options.push({
            label: resDatum.name+"（" + resDatum.host + ":" + resDatum.port +"）",
            value: String(resDatum.id)
          });
        }
        this.dataSourceSelect.options = options;
        if (options.length > 0) {
          this.dataSourceSelect.value = options[0].value
        }
      }).catch((response) => {

      });
      // 产品信息
      request({
        url: '/api/lowcode/initialconfig/productInfo/page',
        method: 'get',
        data: {},
      }).then(res => {
        this.productInfos = res.data.records;
      }).catch(res => {
        alert("请求出错"+res);
      });

      const { type } = this.generateConf
      this.htmlCode = makeUpHtml(this.formData, type)
      this.jsCode = makeUpJs(this.formData,this.projInfo,type)
      this.cssCode = makeUpCss(this.formData)
      this.editJsCode = makeUpEditJs(this.formData,this.projInfo, type)

      loadBeautifier(btf => {
        beautifier = btf
        this.htmlCode = beautifier.html(this.htmlCode, beautifierConf.html)
        this.jsCode = beautifier.js(this.jsCode, beautifierConf.js)
        this.cssCode = beautifier.css(this.cssCode, beautifierConf.html)
        this.editJsCode = beautifier.js(this.editJsCode, beautifierConf.js)

        loadMonaco(val => {
          monaco = val
          const addVue = beautifier.html(vueTemplate(this.htmlCode) + vueScript(this.jsCode) + cssStyle(this.cssCode),
            beautifierConf.html)
          this.setEditorValue('editorAdd', 'add', addVue)
          // 编辑页面
          const editVue = beautifier.html(vueTemplate(this.htmlCode) + vueScript(this.editJsCode) + cssStyle(this.cssCode),
            beautifierConf.html)
          this.setEditorValue('editorEdit', 'edit', editVue)

          this.setEditorValue('editorList', 'list', "list页面由后端生成")
          // this.setEditorValue('editorJs', 'js', this.jsCode)
          // this.setEditorValue('editorCss', 'css', this.cssCode)
          /**
           *  请求后台生成sql
           */
          this.$axios({
            method: 'post',
            url: `/api/lowcode/rapid/genSql?tableName=${this.formData.formRef}`,
            data: this.formData.fields
          }).then(resp => {
            sqlValue = resp.data.data;
            this.setEditorValue('editorSql', 'pgsql', resp.data.data)
          })
          if (!this.isInitcode) {
            this.isRefreshCode = true
            this.isIframeLoaded && (this.isInitcode = true) && this.runCode()
          }
        })
      })
    },
    onClose() {
      this.isInitcode = false
      this.isRefreshCode = false
    },
    setEditorValue(id, type, codeStr) {
      if (editorObj[type]) {
        editorObj[type].setValue(codeStr)
      } else {
        editorObj[type] = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: 'vs-dark',
          language: mode[type],
          automaticLayout: true
        })
      }
      // ctrl + s 刷新
      editorObj[type].onKeyDown(e => {
        if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
          this.runCode()
        }
      })
    },
    showResource() {
      this.resourceVisible = true
    },
    setResource(arr) {
      const scripts = []; const
        links = []
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (item.endsWith('.css')) {
            links.push(item)
          } else {
            scripts.push(item)
          }
        })
        this.scripts = scripts
        this.links = links
      } else {
        this.scripts = []
        this.links = []
      }
    },
    /**
     * 执行sql
     */
    previewBackendCode() {
      if (!this.projInfo.description) {
         alert("表描述不能为空");
         return false;
      }
      // 执行sql，生成表
      request({
        url: "/api/lowcode/rapid/database/"+this.dataSourceSelect.value +"/executeSql" ,
        method: "post",
        data :  "" + editorObj.pgsql.getValue()
      }).then(res => {
        this.$message({
          showClose: true,
          message: '执行成功',
          type: 'success'
        });
      })
    },

    /**
     * 安装代码
     */
    installCode() {
      let params = {
        datasourceInfoId: this.dataSourceSelect.value,
        moduleInfoId:this.moduleId,
        metaDataQuery: this.projInfo,
        tableNames: [this.formData.formRef],
        tablePrefix: this.projInfo.tablePrefix,
        addVue: editorObj.add.getValue(),
        editVue: editorObj.edit.getValue(),
        override: this.projInfo.override
      }
      console.log(params)
      this.$refs['groupForm'].validate((valid) => {
        if (!valid) {
          return false;
        }
        request({
          url: "/api/lowcode/rapid/installCode" ,
          method: "post",
          data : params
        }).then(res => {
          // 后台随机目录
          this.$alert('打开在线编辑器', '安装成功', {
            confirmButtonText: '确定',
            callback: (action) => {
              window.open("http://127.0.0.1:5000?folder="+res.data[0]);
              window.open("http://127.0.0.1:5000?folder="+res.data[1]);
            }
          });
        })
      })
    },
    selectDataSource() {

    },
    handleClose(tag) {
      this.projInfo.tablePrefix.splice(this.projInfo.tablePrefix.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.projInfo.tablePrefix.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    querySearchAsync(query,callback) {
       let resutl = [
         { value: 'vue', link: 'https://github.com/vuejs/vue' },
         { value: 'element', link: 'https://github.com/ElemeFE/element' },
         { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
         { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
         { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
         { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
         { value: 'babel', link: 'https://github.com/babel/babel' },
       ];
       callback(resutl)

     },
    handleSelect(item) {
       console.log(item);
     },
    // 选择产品
    onProductChange(item) {
      //
      this.projInfo.companyName = item.companyName;
      this.projInfo.productName = item.productName;
      // 模块信息
      request({
        url: '/api/lowcode/initialconfig/moduleInfo/listByProductId',
        method: 'get',
        params: {'productId':item.id},
      }).then(res => {
        this.moduleInfos = res.data;
      }).catch(res => {
        alert("请求出错"+res);
      });
    },
    onModuleChange(item) {
      this.projInfo.moduleName = item.moduleName;
      this.moduleId = item.id;
    }

  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.tab-editor {
  position: absolute;
  top: 33px;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 14px;
}
.left-editor {
  position: relative;
  height: 100%;
  background: #1e1e1e;
  overflow: hidden;
}
.setting{
  position: absolute;
  right: 15px;
  top: 3px;
  color: #a9f122;
  font-size: 18px;
  cursor: pointer;
  z-index: 1;
}
.right-preview {
  height: 100%;
  .result-wrapper {
    height: calc(100vh - 33px);
    width: 100%;
    overflow: auto;
    padding: 12px;
    box-sizing: border-box;
  }
}
@include action-bar;
::v-deep .el-drawer__header {
  display: none;
}
</style>
