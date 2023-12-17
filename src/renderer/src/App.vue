<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-date-picker v-model="searchFromDate" type="date" :clearable="false" />
        <el-button @click="logSearchFromDate"></el-button>
      </el-header>
      <el-main>
        <el-table
          ref="multipleTableRef"
          class="dataTable"
          :data="wallpaperDatas"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" prop="selected"></el-table-column>
          <el-table-column prop="oriName" label="原文件名"></el-table-column>
          <el-table-column prop="newName" label="新文件名"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElTable } from 'element-plus'
interface WallpaperData {
  oriName: string
  newName: string
  selected: boolean
}
// 响应式状态
// searchFromDate
const MILLISECONDS_IN_DAY = 86400000
const searchFromDate = ref(new Date(Date.now() - MILLISECONDS_IN_DAY).toDateString())

// table data
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<WallpaperData[]>([])
const wallpaperDatas: WallpaperData[] = [
  { oriName: 'oriName1', newName: 'newName1', selected: false },
  { oriName: 'oriName2', newName: 'newName2', selected: false }
]

// 方法
const handleSelectionChange = (datas: WallpaperData[]) => {
  multipleSelection.value = datas
}
const logSearchFromDate = () => {
  console.log(searchFromDate)
}
</script>

<style lang="less">
@import './assets/css/styles.less';
</style>
