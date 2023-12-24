<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-row :gutter="60">
          <el-col :span="9">
            <el-button
              :type="hasSteamRootSet ? 'primary' : 'danger'"
              :icon="hasSteamRootSet ? CircleCheckFilled : WarningFilled"
              round
              @click="setSteamLocation"
            >
              {{ hasSteamRootSet ? 'steam位置已设置' : '请设置steam位置' }}
            </el-button>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="moveTargetPath"
              placeholder="Please Select"
              style="width: 500px"
              :readonly="true"
            >
              <template #append>
                <el-icon style="cursor: pointer" @click="openDialog">
                  <FolderOpened />
                </el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-date-picker v-model="searchFromDate" type="date" :clearable="false" />
          </el-col>
          <el-col :span="6">
            <el-button @click="getWallpaperDatas">获取壁纸信息</el-button>
          </el-col>
        </el-row>
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
import { FolderOpened, CircleCheckFilled, WarningFilled } from '@element-plus/icons-vue'
import { ElTable, ElMessage } from 'element-plus'
import { MILLISECONDS_IN_DAY, WallpaperData } from '../../common/types'

// search
const searchRootPath = ref('E:\\Steam\\steamapps\\workshop\\content\\431960')
const hasSteamRootSet = ref(false)
const searchFromDate = ref(new Date(Date.now() - MILLISECONDS_IN_DAY))
const searchExtensions = ref(['.json'])

// data
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<WallpaperData[]>([])
const refWallpaperDatas = ref<WallpaperData[]>([])

// movie
const moveTargetPath = ref('E:\\new')

// function
async function setSteamLocation() {
  console.log('hello ')
  
  const result = await window.steamApi.setSteamLocation()
  console.log(result)
}

function openDialog() {
  console.log('nihao')
}

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
  ElMessage({
    showClose: true,
    message: '获取 ' + wallpaperDatas.length + ' 个壁纸信息',
    type: 'success'
  })
  refWallpaperDatas.value = wallpaperDatas
}
// function moveWallpaper() {

// }
</script>

<style lang="less">
@import './assets/css/styles.less';
</style>
