<template>
  <div class="common-layout">
    <el-container>
      <!-- 第一行按钮 -->
      <el-header>
        <el-row :gutter="20">
          <el-col :span="5">
            <el-button
              :type="hasSteamRootSet ? 'primary' : 'danger'"
              :icon="hasSteamRootSet ? CircleCheckFilled : WarningFilled"
              :disabled="hasSteamRootSet"
              round
              @click="setSteamLocation"
            >
              {{ hasSteamRootSet ? 'steam.exe位置已设置' : '请设置steam.exe位置' }}
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-input v-model="moveTargetPath" placeholder="Please Select" :readonly="true">
              <template #append>
                <el-icon style="cursor: pointer" @click="openDialog">
                  <FolderOpened />
                </el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-date-picker v-model="searchFromDate" type="date" :clearable="false" />
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="searchSelected"
              multiple
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
              placeholder="Choose tags for your article"
            >
              <el-option v-for="item in searchOptions" :key="item.value" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-button :loading="isSearching" @click="getWallpaperDatas">获取壁纸信息</el-button>
          </el-col>
          <el-col :span="2">
            <el-button :loading="isMoving" @click="moveWallpaperFiles">开移!</el-button>
          </el-col>
        </el-row>
      </el-header>
      <!-- 壁纸显示 -->
      <el-main>
        <el-row :gutter="20">
          <el-col v-for="(item, index) in refWallpaperDatas" :key="index" :span="6">
            <el-card
              :class="['card', { 'is-selected': item.selected }]"
              @click="toggleSelection(item)"
            >
              <el-image class="card-image" :src="item.preview" fit="cover" />
              <div class="card-content">
                <el-text class="card-title">{{ item.title }}</el-text>
                <el-divider border-style="dotted" />
                <el-text class="card-path"> 本地路径:<br />{{ item.path }} </el-text>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FolderOpened, CircleCheckFilled, WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { MILLISECONDS_IN_DAY, SelectableWallpaperData, WallpaperData } from '../../common/types'

// search
const hasSteamRootSet = ref(false)
const searchFromDate = ref(new Date(Date.now() - MILLISECONDS_IN_DAY))
const searchSelected = ref<string[]>(['.mp4'])
const searchOptions = [
  {
    value: '.mp4',
    label: '.mp4'
  }
]
const isSearching = ref(false)
const isMoving = ref(false)

// data
const refWallpaperDatas = ref<SelectableWallpaperData[]>([])

// move
const moveTargetPath = ref('E:\\')

//#region vue lifecycle hooks
onMounted(async () => {
  hasSteamRootSet.value = await window.wallpaperApi.hasSetSteamLocation()
  moveTargetPath.value = await window.wallpaperApi.getMovePath()
  getWallpaperDatas()
})
//#endregion

//#region function
async function setSteamLocation() {
  const result = await window.wallpaperApi.setSteamLocation()
  if (!result) {
    ElMessage({
      message: '路径设置失败，检查是否设置steam.exe以及WallpaperEngine是否安装',
      type: 'error'
    })
  }
}

async function openDialog() {
  const folderPath = await window.commonApi.getFolderPath()
  const setResult = await window.wallpaperApi.setMovePath(folderPath)
  if (setResult) {
    moveTargetPath.value = folderPath
  } else {
    // 如果设置失败则弹窗提示一下
    ElMessage({
      showClose: true,
      message: '获取移动路径失败',
      type: 'error'
    })
  }
}

function getWallpaperDatas() {
  isSearching.value = true
  window.wallpaperApi
    .getWallpaperDatas(
      searchFromDate.value,
      // ref数组都是Proxy类型,引用类型无法ipc传输
      // 再用通用的一句话来说，无法传输带有方法的类
      // 不然会报clone啥的错
      JSON.parse(JSON.stringify(searchSelected.value))
    )
    .then((wallpaperDatas) => {
      isSearching.value = false
      ElMessage({
        showClose: true,
        message: '获取 ' + wallpaperDatas.length + ' 个壁纸信息',
        type: 'success'
      })
      refWallpaperDatas.value = wallpaperDatas
    })
}

function toggleSelection(item) {
  item.selected = !item.selected
}

function moveWallpaperFiles() {
  isMoving.value = true
  const needMoveWallpaperDatas: WallpaperData[] = []
  for (const item of refWallpaperDatas.value) {
    if (item.selected) {
      needMoveWallpaperDatas.push(JSON.parse(JSON.stringify(item)))
      item.selected = false
    }
  }
  window.wallpaperApi.moveWallpaperFiles(needMoveWallpaperDatas).then(() => {
    isMoving.value = false
  })
}
//#endregion
</script>

<style lang="less">
@import './assets/css/styles.less';
</style>
