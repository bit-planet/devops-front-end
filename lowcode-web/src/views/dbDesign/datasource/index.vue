<template>

  <div class="system-user-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-row :gutter="10" align="middle">
          <el-col :span="3" align="left">
            <el-button @click="openAddMenu('')" type="primary"><i class="el-icon-document-add"></i>新增</el-button>
          </el-col>

          <el-col :span="6" align="left">
            <el-select v-model="value" placeholder="20.5.120.38/credit">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="12" align="right">
            <el-input size="small" type="text" placeholder="请输入用户名" prefix-icon="el-icon-search"
                      style="max-width: 180px"></el-input>
            <el-button size="small" type="primary" class="ml10">查询</el-button>
          </el-col>

        </el-row>
      </div>
      <el-table :data="tableData.data" stripe border
                @selection-change="handleSelectionChange"
                style="width: 100%">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="id" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="连接名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="host" label="主机:端口" show-overflow-tooltip></el-table-column>
        <el-table-column prop="type" label="连接类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createUserId" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="path" label="操作" width="120">
          <template #default="scope">
            <el-button size="mini" type="text">修改</el-button>

            <el-popconfirm
                confirm-button-text="是"
                cancel-button-text="否"
                :icon="InfoFilled"
                icon-color="red"
                title="你确定删除此条信息吗?"
                @confirm="confirmRowDel(scope.row)"
            >
              <template #reference>
                <el-button size="mini" type="text" >删除</el-button>
              </template>
            </el-popconfirm>



          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="onHandleSizeChange"
          @current-change="onHandleCurrentChange"
          class="mt15"
          :pager-count="5"
          :page-sizes="[10, 20, 30]"
          v-model:current-page="tableData.param.pageNum"
          background
          v-model:page-size="tableData.param.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
      >
      </el-pagination>
    </el-card>

    <AddMenu ref="addMenuRef"/>
    <EditMenu ref="editMenuRef"/>
  </div>
</template>

<script setup lang="ts">
import {toRefs, reactive, onMounted, onBeforeMount, ref, getCurrentInstance} from 'vue';
import {infoList,deleteRow} from "/@/api/dbDesign/datasource";
import AddMenu from '/@/views/dbDesign/datasource/component/addMenu.vue';
import EditMenu from '/@/views/dbDesign/datasource/component/editMenu.vue';

import axios from 'axios'
import {useRoute} from "vue-router";
import {refreshCurrentTag} from "/@/utils/tagsViews";
import ElMessage from "element-plus/es";

const tableData = reactive({
  data: [],
  total: 0,
  loading: false,
  param: {
    pageNum: 1,
    pageSize: 10,
  },
});

// 初始化表格数据
let initTableData = () => {
  const data: Array<object> = [];
  infoList({"s": ""}).then((res) => {
    const resData = res.data;
    for (let i = 0; i < resData.length; i++) {
      const info = resData[i];
      console.log(info.id)
      data.push({
        id: info.id,
        name: info.name,
        host: info.host + ":" +info.port,
        type: info.type,
        createUserId: info.createUserId,
        createTime: info.createTime,
        updateTime: info.updateTime,
      })
    }
    tableData.data = data;
    tableData.total = tableData.data.length;
  }).catch((response) => {
    console.log(response);
  })


};

var {proxy} = getCurrentInstance() as any;
const route = useRoute();

// 当前行删除
const confirmRowDel = (row:any) => {
   deleteRow(row.id).then((res) => {
     refreshCurrentTag(proxy,route);
   }).catch((res) => {
     console.log(res);
   })
};
// 分页改变
const onHandleSizeChange = (val: number) => {
  tableData.param.pageSize = val;
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
  tableData.param.pageNum = val;
};

// 页面加载时
onMounted(() => {
  initTableData();
});
const addMenuRef = ref();
// 点击新增按钮
const openAddMenu = (obj: object) => {
  addMenuRef.value.openDialog(obj);
}
</script>

<script lang="ts">
export default {
  name: 'systemUser',
  methods: {
    handleSelectionChange(val: any) {
      console.log(val)
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
</style>
