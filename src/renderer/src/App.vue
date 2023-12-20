<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-date-picker v-model="searchFromDate" type="date" :clearable="false" />
        <el-button @click="logSearchFromDate">logSearchFromDate</el-button>
        <el-button @click="getWallpaperDatas">getWallpaperDatas</el-button>
        <!-- <el-button @click="testFunction">testFunction</el-button> -->
      </el-header>
      <el-main>
        <el-table :data="refWallpaperDatas" class="dataTable">
          <!-- <el-table-column type="selection" prop="selected"></el-table-column> -->
          <el-table-column prop="path" label="原文件地址"></el-table-column>
          <el-table-column prop="title" label="新文件名"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElTable } from 'element-plus'
import { WallpaperData } from '../../common/types'

// 响应式状态
// searchFromDate
const MILLISECONDS_IN_DAY = 86400000
const searchFromDate = ref(new Date(Date.now() - MILLISECONDS_IN_DAY))
const searchRootPath = ref('E:\\Steam\\steamapps\\workshop\\content\\431960')
const searchExtensions = ref(['.json'])

// interface WallpaperTableData {
//   wallpaperData: WallpaperData
//   selected: boolean
// }

// table data
// const multipleTableRef = ref<InstanceType<typeof ElTable>>()
// const multipleSelection = ref<WallpaperData[]>([])
// const wallpaperTableDatas = ref<WallpaperTableData[]>([
//   { wallpaperData: { path: '/path/to/image1', title: 'Image 1' }, selected: false },
//   { wallpaperData: { path: '/path/to/image2', title: 'Image ' }, selected: false }
// ])
const refWallpaperDatas = ref<WallpaperData[]>([{ path: '/path/to/image1', title: 'Image 1' }])

// 方法
// function handleSelectionChange(datas: WallpaperData[]) {
//   multipleSelection.value = datas
// }
function logSearchFromDate() {
  console.log(searchFromDate)
}
// function testFunction() {
//   wallpaperTableDatas.pop()
// }
async function getWallpaperDatas() {
  const wallpaperDatas = await window.wallpaperApi.getWallpaperDatas(
    searchRootPath.value,
    searchFromDate.value,
    JSON.parse(JSON.stringify(searchExtensions.value))
  )
  for (let i = 0; i < refWallpaperDatas.value.length; ++i) {
    refWallpaperDatas.value.pop()
  }
  for (const wallpaperData of wallpaperDatas) {
    refWallpaperDatas.value.push(wallpaperData)
  }
  console.log(refWallpaperDatas)
  // refWallpaperDatas.value = JSON.parse(JSON.stringify(wallpaperDatas))
}
</script>

<style lang="less">
@import './assets/css/styles.less';
</style>
