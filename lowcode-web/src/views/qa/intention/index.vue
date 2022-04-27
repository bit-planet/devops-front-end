<template>
  <div class="system-user-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-input size="small" placeholder="请输入关键字" style="max-width: 180px"></el-input>
        <el-button size="small" type="primary" class="ml10">
          <i class="el-icon-search"></i>
          查询
        </el-button>
        <el-button size="small" type="success" class="ml10" @click="onOpenAddUser">
          <i class="el-icon-document-add"></i>
          新增
        </el-button>
      </div>

      <el-skeleton style="width: 100%" :loading="state.tableLoading" animated>
        <template #template>
          <el-skeleton-item v-for="n in 10" :key="n" variant="h2" style="width: 60%;height: 20px"/>
          <el-skeleton-item v-for="n in 2" :key="n" variant="h2" style="width: 80%;height: 20px"/>
        </template>
        <template #default>
          <el-table :data="state.tableData.records" style="width: 100%"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>
             <el-table-column prop="id" label="ID"></el-table-column>
             <el-table-column prop="sn" label="识别码" show-overflow-tooltip></el-table-column>
             <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
             <el-table-column prop="answerType" label="回复方式" show-overflow-tooltip></el-table-column>
             <el-table-column prop="status" label="状态" show-overflow-tooltip></el-table-column>
             <el-table-column prop="createUserId" label="创建人ID" show-overflow-tooltip></el-table-column>
             <el-table-column prop="updateUserId" label="修改人ID" show-overflow-tooltip></el-table-column>
             <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
             <el-table-column prop="updateTime" label="修改时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button :disabled="scope.row.userName === 'admin'" size="mini" type="text"
                           @click="onOpenEditUser(scope.row)">修改
                </el-button>
                <el-button :disabled="scope.row.userName === 'admin'" size="mini" type="text"
                           @click="onRowDel(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-skeleton>
      <!--分页-->
      <el-pagination
          @size-change="onHandleSizeChange"
          @current-change="onHandleCurrentChange"
          class="mt15"
          :pager-count="5"
          :page-sizes="[10, 20, 30]"
          v-model:current-page="state.tableData.current"
          background
          v-model:page-size="state.tableData.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.tableData.total"
      >
      </el-pagination>
    </el-card>
    <AddDialog ref="addRef" title="新增"/>
    <EditDialog ref="editRef" title="修改"/>
  </div>
</template>

<script setup lang="ts">
  import {reactive, onMounted, ref} from 'vue';
  import {ElMessageBox, ElMessage} from 'element-plus';
  import AddDialog from './component/addDialog.vue';
  import EditDialog from './component/editDialog.vue'
  import request from '/@/utils/request';

  const addRef = ref();
  const editRef = ref();
  const state: any = reactive({
    tableData: {
      records: [],
      total: 0,
      loading: false,
      current: 1,
      size: 10,
    },
    multipleSelection: [],
    tableLoading: true
  });

  // 初始化表格数据
  const initTableData = () => {
    state.tableLoading = true;
    const pageQuery = {
      current: state.tableData.current,
      size: state.tableData.size,
    }
    request({
      url: '/qa/intention/page',
      method: 'get',
      params: pageQuery,
    }).then(res => {
      state.tableData = res.data;
      state.tableLoading = false;
    }).catch(res => {
      ElMessage.error("请求出错")
      state.tableLoading = false;
    });
  };

  // 选中
  const handleSelectionChange = (val: []) => {
    state.multipleSelection = val
  };

  // 打开新增用户弹窗
  const onOpenAddUser = () => {
    addRef.value.open();
  };
  // 打开修改用户弹窗
  const onOpenEditUser = (row: Object) => {
    editRef.value.open(row);
  };
  // 删除用户
  const onRowDel = (row: Object) => {
    ElMessageBox.confirm(`此操作将删除ID为：“${row.id}”，是否继续?`, '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      request({
        url: '/qa/intention/'+row.id,
        method: 'delete',
      }).then(res => {
        ElMessage.success('删除成功');
        initTableData();
      }).catch(res => {
        ElMessage.error("请求出错")
        console.log(res)
      });

    })
    .catch(() => {
    });
  };
  // 分页改变
  const onHandleSizeChange = (val: number) => {
    state.tableData.size = val;
    initTableData();
  };
  // 分页改变
  const onHandleCurrentChange = (val: number) => {
    state.tableData.current = val;
    initTableData();
  };
  // 页面加载时
  onMounted(() => {
    initTableData();
  });

  defineExpose({
    initTableData
  });

</script>

<style scoped lang="scss">
  .system-user-container {
  }
</style>
