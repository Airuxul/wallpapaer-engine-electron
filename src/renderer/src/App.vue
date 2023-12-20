<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-date-picker v-model="searchFromDate" type="date" :clearable="false" />
        <el-button @click="getWallpaperDatas">getWallpaperDatas</el-button>
      </el-header>
      <el-main>
        <el-table
          ref="multipleTableRef"
          :data="refWallpaperDatas"
          class="dataTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="path" label="原文件地址"></el-table-column>
          <el-table-column prop="title" label="新文件名"></el-table-column>
          <el-table-column type="selection" prop="selected"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElTable } from 'element-plus'
import { WallpaperData } from '../../common/types'

// search
const MILLISECONDS_IN_DAY = 86400000
const searchFromDate = ref(new Date(Date.now() - MILLISECONDS_IN_DAY))
const searchRootPath = ref('E:\\Steam\\steamapps\\workshop\\content\\431960')
const searchExtensions = ref(['.json'])

// data
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<WallpaperData[]>([])
const refWallpaperDatas = ref<WallpaperData[]>([{ path: '/path/to/image1', title: 'Image 1' }])

// function
function handleSelectionChange(datas: WallpaperData[]) {
  multipleSelection.value = datas
}

async function getWallpaperDatas() {
  const wallpaperDatas = await window.wallpaperApi.getWallpaperDatas(
    searchRootPath.value,
    searchFromDate.value,
    // ref数组都是Proxy类型,引用类型无法ipc传输
    // 再用通用的一句话来说，无法传输带有方法的类
    // 不然会报clone啥的错
    JSON.parse(JSON.stringify(searchExtensions.value))
  )
  refWallpaperDatas.value = wallpaperDatas
}
</script>

<style lang="less">
@import './assets/css/styles.less';
</style>
