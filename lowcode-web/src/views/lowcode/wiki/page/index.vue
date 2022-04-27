<template>
  <el-row :gutter="8">
    <el-col :span="6">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span id="wikiName">{{wikiName}}</span>
            <el-button class="el-icon-plus" type="primary" circle size="small" @click="addTreeNode"></el-button>
          </div>
        </template>

        <el-scrollbar style="display: flex;">
          <div class="custom-tree-container">
            <el-tree
                ref="tree"
                :data="dataSource"
                :allow-drop="allowDrop"
                :allow-drag="allowDrag"
                draggable
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                :check-on-click-node="true"
                @node-drag-start="handleDragStart"
                @node-drag-enter="handleDragEnter"
                @node-drag-leave="handleDragLeave"
                @node-drag-over="handleDragOver"
                @node-drag-end="handleDragEnd"
                @node-drop="handleDrop"

                @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          &nbsp;&nbsp;
          <span>
            <a style="color: #0d84ff" @click.stop="append(data)">&nbsp;+&nbsp;</a> &nbsp;&nbsp;
            <a style="color: #0d84ff" @click.stop="remove(node, data)">&nbsp;-&nbsp;</a>
          </span>
        </span>
              </template>
            </el-tree>
          </div>
        </el-scrollbar>
      </el-card>
    </el-col>
    <el-col :span="18">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span style="color: #909399;font-size: var(--el-font-size-extra-small)">
              <el-icon class="el-icon-alarm-clock"></el-icon>
              <span>&nbsp;最后一次更新&nbsp;</span>
              <span id="lastUpdateTime">&nbsp;</span>
            </span>
            <el-button size="small" @click="addTreeNode"><el-icon class="el-icon-s-promotion"></el-icon>发布</el-button>
          </div>
        </template>
      <markdown-editor ref="editorRef" :id="options.editorId" :options="options" :handleChange="handleEditorChange"></markdown-editor>
      </el-card>
    </el-col>
  </el-row>

</template>

<script lang="ts" setup>
import {reactive, ref, watch, shallowRef, toRaw, unref, getCurrentInstance} from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import MarkdownEditor from "./component/markdownEditor.vue";
import request from '/@/utils/request';
import {useRoute} from "vue-router";

const self:any = getCurrentInstance();
const dataSource = reactive<Tree[]>(
    []
)

let route = useRoute();
let wikiName ='';
// 初始化加载wiki状态
let isInitialLoaded = false;

request({
  url: '/lowcode/wiki/wiki/' + route.query.id,
  method: 'get',
}).then(res => {
  $('#wikiName').html(res.data.name);
  wikiName = res.data.name;
  dataSource.push.apply(dataSource,res.data.treeJson);
  setTimeout(function (){
    isInitialLoaded = true;
  },1000);
}).catch(res => {
  console.log(res);
});

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

function newNode(callback) {
  let title = '无标题'
  let markdownDraft = "# " + title;
  request({
    url: '/lowcode/wiki/wikiPage',
    method: 'post',
    data: {'title': title,'markdownDraft' : markdownDraft},
  }).then(res => {
    callback(res);
  }).catch(res => {
    console.log(res)
  })
}

/**
 * 追加一个一级节点
 */
const addTreeNode = () => {
  newNode(res  =>{
    const newChild = { id: res.data.id, label: res.data.title, children: [] };
    dataSource.push(newChild);
  });
}

const append = (data: Tree) => {
  newNode(res => {
    const newChild = { id: res.data.id, label: res.data.title, children: [] }
    if (!data.children) {
      data.children = []
    }
    data.children.push(newChild)
  })
}

const remove = (node: Node, data: Tree) => {
  const parent = node.parent
  const children: Tree[] = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === data.id)
  children.splice(index, 1)
}



watch(dataSource,(newValue,oldValue) => {
  if (!isInitialLoaded) {
    // 初始化成功之前不触发更新
    return false;
  }
  request({
    url: '/lowcode/wiki/wiki/' + route.query.id,
    method: 'put',
    data: {'treeJson':toRaw(dataSource)},
  }).then(res => {

  }).catch(res => {
    console.log(res);
  });


});



const tree = ref();
/**
 * 节点点击
 */
const editorRef = ref();
const options = reactive({width:"100%",editorId:0});
const handleNodeClick = (node: Node) => {
  let vm = editorRef.value;
  options.editorId = node.id;
  request({
    url: '/lowcode/wiki/wikiPage/' + node.id,
    method: 'get',
  }).then(res => {
    options.markdown = res.data.markdownDraft;
    // //加载editormd
    vm.requireEditor(function(){
      vm.editor = editormd(vm.id,vm.getOptions());
    });
    $("#lastUpdateTime").html(res.data.updateTime);
  }).catch(res => {
    console.log(res);
  });
}
// 编辑器发生改变
const handleEditorChange = () => {
  let currentNodeId = options.editorId;
  let node = tree.value.getNode(currentNodeId);
  // 修改标签触发保存
  node.data.label = getTitle().replace(/^#+/g,"");
  // 修改page draft
  request({
    url: '/lowcode/wiki/wikiPage/' + currentNodeId,
    method: 'put',
    data: {'markdownDraft':editorRef.value.editor.getMarkdown()},
  }).then(res => {

  }).catch(res => {
    console.log(res);
  });

}

/**
 * 获取markdown 标题
 * 默认第一个带 # 号的标题
 */
const getTitle = () => {
  let markdownText = editorRef.value.editor.getMarkdown();
  let regExp = new RegExp("#\.+");
  let title = regExp.exec(markdownText);
  if (!title) {
    return "";
  }
  return title[0].trim();
}


const handleDragStart = (node: Node, ev: DragEvents) => {
  console.log('drag start', node)
}
const handleDragEnter = (
    draggingNode: Node,
    dropNode: Node,
    ev: DragEvents
) => {
  console.log('tree drag enter: ', dropNode.label)
}
const handleDragLeave = (
    draggingNode: Node,
    dropNode: Node,
    ev: DragEvents
) => {
  console.log('tree drag leave: ', dropNode.label)
}
const handleDragOver = (draggingNode: Node, dropNode: Node, ev: DragEvents) => {
  console.log('tree drag over: ', dropNode.label)
}
const handleDragEnd = (
    draggingNode: Node,
    dropNode: Node,
    dropType: DropType,
    ev: DragEvents
) => {
  console.log('tree drag end: ', dropNode && dropNode.label, dropType)
}
const handleDrop = (
    draggingNode: Node,
    dropNode: Node,
    dropType: DropType,
    ev: DragEvents
) => {
  console.log('tree drop: ', dropNode.label, dropType)
}
</script>

<style>

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

/*节点悬浮over变色*/
div.is-drop-inner>.el-tree-node__content .custom-tree-node{
  background-color: var(--el-color-primary);
  color: #fff;
}
</style>