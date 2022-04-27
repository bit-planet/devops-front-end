<template>

  <div class="system-user-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-row :gutter="10" align="middle">
          <el-col :span="12" align="left">
            <el-select v-model="tableData.value" @change="selectDataSource" placeholder="">
              <el-option
                  v-for="item in tableData.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="12" align="right">
            <el-input  size="small" placeholder="搜索表名" v-model="searchText" type="text" prefix-icon="el-icon-search"
                      style="max-width: 180px"></el-input>
          </el-col>

        </el-row>

        <el-form r :rules="tableData.rules"
                 :model="tableData.projInfo" label-width="110px"
                 style="width: 100%;margin-top: 15px"
                 align="left" label-position="left"
                 :gutter="1" ref="groupForm"
                 :size="medium"
        >

          <el-row :gutter="20" >
            <el-col :span="6">
              <el-form-item label="组织：" prop="companyName">
                <el-input v-model="tableData.projInfo.companyName"  placeholder="域.公司（例:com.tansun）"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="项目/产品：" prop="productName">
                <el-input v-model="tableData.projInfo.productName"  placeholder="例：credit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="模块名：" prop="moduleName">
                <el-input v-model="tableData.projInfo.moduleName" placeholder="例：loan"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="子模块：" prop="subModuleName">
                <el-input v-model="tableData.projInfo.subModuleName" placeholder="例：datasource"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="6">
              <el-form-item label="版本号：" prop="version">
                <el-input v-model="tableData.projInfo.version" placeholder="例：1.0.0.RELEASE"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item  label="描述：">
                <el-input v-model="tableData.projInfo.description" placeholder="可选项" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="去表前缀：">
                <el-tag
                        v-for="tag in tablePrefix"
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
            <el-col :span="4" align="right">
              <el-button type="primary" @click="clickGenCode">生成代码</el-button>
            </el-col>
          </el-row>
        </el-form>


      </div>
      <el-table :data="tableData.data" stripe border
                @selection-change="handleSelectionChange"
                style="width: 100%">
        <el-table-column v-model="tableData.options" type="selection" width="55"/>
        <el-table-column prop="oid" label="OID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tableName" label="表名"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="tableCatalog" label="库名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tableSchema" label="模式（Schema）" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tableType" label="类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tableDescription" label="注释" show-overflow-tooltip></el-table-column>
        <el-table-column prop="path" label="操作" width="120">
          <template #default="scope">
            <el-button @click="openAddMenu(scope.row)" size="mini" type="text">查看表结构</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="onHandleSizeChange"
          @current-change="onHandleCurrentChange"
          class="mt15"
          :pager-count="5"
          :page-sizes="[tableData.param.pageSize]"
          v-model:current-page="tableData.param.pageNum"
          background
          v-model:page-size="tableData.param.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
      >
      </el-pagination>
    </el-card>

    <table_detail ref="tableDetail" />
  </div>
</template>

<script setup lang="ts">
import {toRefs, reactive, onMounted, onBeforeMount, ref, getCurrentInstance} from 'vue';
import {infoList,deleteRow} from "/@/api/dbDesign/datasource";
import table_detail from '/@/views/rapid/gencode/component/tableDetail.vue';

import axios from 'axios'
import {useRoute} from "vue-router";
import {refreshCurrentTag} from "/@/utils/tagsViews";
import {allTables, genCode} from "/@/api/dbDesign/rapid/gencode";
import { ElMessage, ElMessageBox } from 'element-plus';

// const change = () => {
//   // this.$forceUpdate;
// }




const tableData = reactive({
  data: [],
  dataClone:[],
  options: [{label:'',value:''}],
  value:'',
  selectRows:[],
  projInfo:{
    companyName:'com.tansun',
    productName:'credit',
    moduleName:'',
    subModuleName: '',
    version:'1.0.0.RELEASE',
    description:''
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
  },
  total: 0,
  loading: false,
  param: {
    pageNum: 1,
    pageSize: 10,
  },
});



// 初始化表格数据
let initTableData = (dataSourceInfoId:String) => {
  const data: Array<object> = [];
  allTables(dataSourceInfoId).then((res) => {
    const resData = res.data;
    for (let i = 0; i < resData.length; i++) {
      const table = resData[i];
      data.push(table);
      tableData.dataClone.push(table);
    }
    tableData.data = data;
    tableData.param.pageSize = resData.length
    tableData.total = tableData.data.length;
  }).catch((response) => {
    console.log(response);
    tableData.data = [];
    tableData.total = 0;
  })


};

const {proxy} = getCurrentInstance() as any;
const route = useRoute();

// 分页改变
const onHandleSizeChange = (val: number) => {
  tableData.param.pageSize = val;
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
  tableData.param.pageNum = val;
};





infoList("").then((res) => {
  const resData = res.data;
  let  options = [];

  for (let dataKey in resData) {
    let resDatum = resData[dataKey];
    options.push({
        label: resDatum.name+"（" + resDatum.host + ":" + resDatum.port +"）",
        value: String(resDatum.id)
    });
  }
  tableData.options = options;
  if (options.length > 0) {
     tableData.value = options[0].value
     initTableData(options[0].value)
  }
}).catch((response) => {
  console.log(response);
})

const selectDataSource = (selectValue:any) => {
  initTableData(selectValue)
}

/**
 *  表詳情
 */
const  tableDetail = ref();
const openAddMenu = (obj: object) => {
  tableDetail.value.openDialog(tableData.value,obj);
}

const  handleSelectionChange = (val: any) => {
  tableData.selectRows = val;
}

// const groupForm = ref();
const clickGenCode = () => {
  // console.log(proxy.$refs['groupForm'] == groupForm.value);// true
  // 使用$refs写法
  proxy.$refs['groupForm'].validate((valid:boolean) => {
    if (valid) {
      if ( !tableData.selectRows  || tableData.selectRows.length === 0) {
        ElMessageBox.alert("请至少选择一张表！")
        return
      }
      let tableNames = [];
      for (let i in tableData.selectRows) {
        let selectRow = tableData.selectRows[i];
        tableNames.push(selectRow.tableName);
      }
      let params = {
        datasourceInfoId:tableData.value,
        metaDataQuery:tableData.projInfo,
        tableNames:tableNames,
        tablePrefix:proxy.tablePrefix
      }
      genCode(params).then(res => {
         window.open("/api/"+res.data) // 下载zip
      }).catch(res => {
        ElMessage.error(res)
      })

    } else {
      console.log('error submit!!')
      return false;
    }
  })

}



</script>

<script lang="ts">
  import {reactive} from "vue";


export default {
  name: 'systemUser',
  data() {
    return {
      tablePrefix: [],
      inputVisible: false,
      inputValue: '',
      searchText:''
    }
  },
  watch: {
    searchText: function (val) {
      console.log(val)
      let resultData = this.tableData.dataClone.filter((item)=> {
        if (item.tableName.search(val) != -1) {
          return true;
        }
        return false;
      });
      this.tableData.data = resultData;
    }
  },
  methods: {
    handleClose(tag) {
      this.tablePrefix.splice(this.tablePrefix.indexOf(tag), 1)
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
        this.tablePrefix.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
  }
};
</script>

<style scoped lang="scss">
.system-user-container {
  .system-user-search {
    text-align: right;
  }

  .system-user-photo {
    width: 40px;
    height: 40px;
    border-radius: 100%;
  }
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}


</style>
