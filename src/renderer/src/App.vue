<template>
  <div style="display: flex">
    <div style="width: 80%">
      <div>
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
          <el-col :span="5">
            <el-input v-model="moveTargetPath" placeholder="Please Select" :readonly="true">
              <template #append>
                <el-icon style="cursor: pointer" @click="openDialog">
                  <FolderOpened />
                </el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="5">
            <el-date-picker v-model="searchFromDate" type="date" :clearable="false" />
          </el-col>
          <el-col :span="5">
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
          <el-col :span="3">
            <el-button @click="moveWallpaperDatas">移动壁纸</el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-scrollbar always>
          <el-row>
            <el-col
              v-for="(wallpaperData, index) in refWallpaperDatas"
              :key="wallpaperData"
              :span="4"
              style="padding: 16px"
            >
              <el-card
                :class="
                  index >= minSelectIndex && index <= maxSelectIndex
                    ? 'wallpaperCard-selected'
                    : 'wallpaperCard'
                "
                body-class="wallpaperCard-body"
                @click="onCardClick(index)"
              >
                <img
                  :src="getElectronImgSrc(wallpaperData.preview)"
                  class="wallpaperCard-image"
                  fit="fill"
                />
                <div style="padding: 14px">
                  <span>{{ wallpaperData.title }}</span>
                  <!-- <span>{{ wallpaperData.description }}</span> -->
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-scrollbar>
      </div>
    </div>
    <AsideDetail style="width: 20%" :wallpapaer-data="refWallpaperDatas.values[0]"></AsideDetail>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import AsideDetail from './components/AsideDetail.vue'
import { FolderOpened, CircleCheckFilled, WarningFilled } from '@element-plus/icons-vue'
import { toRaw } from 'vue'

import { WallpaperData } from '@common/types'
import { MILLISECONDS_IN_DAY, KEY_STR } from '@common/const'

import { getElectronImgSrc } from './rendererUtils'
// search
const searchRootPath = ref('E:\\Steam\\steamapps\\workshop\\content\\431960')
const hasSteamRootSet = ref(false)
const searchFromDate = ref(new Date(Date.now() - MILLISECONDS_IN_DAY))
const searchSelected = ref<string[]>([])
const searchOptions: { value; label }[] = []
const isSearching = ref(false)

// wallpaperData
const refWallpaperDatas = ref<WallpaperData[]>([])

// movie
const moveTargetPath = ref('E:\\new')

//#region html hook
let shiftKeyHold = false
window.addEventListener('keydown', (code) => {
  if (code.shiftKey) {
    shiftKeyHold = true
  }
})
window.addEventListener('keyup', (code) => {
  if (code.key === KEY_STR.SHIFT) {
    shiftKeyHold = false
  }
})
//#endregion

//#region vue lifecycle hooks
onMounted(async () => {
  getWallpaperDatas()
  hasSteamRootSet.value = await window.steamApi.hasSetSteamLocation()
})
//#endregion

//#region ui event
const minSelectIndex = ref(0)
const maxSelectIndex = ref(0)
function onCardClick(clickIndex: number) {
  let minIndex = minSelectIndex.value
  let maxIndex = maxSelectIndex.value
  if (shiftKeyHold) {
    if (minIndex > clickIndex) {
      minIndex = clickIndex
    } else if (clickIndex < maxIndex) {
      const toMinDis = clickIndex - minIndex
      const toMaxDis = maxIndex - clickIndex
      if (toMinDis > toMaxDis) {
        maxIndex = clickIndex
      } else {
        minIndex = clickIndex
      }
    } else {
      maxIndex = clickIndex
    }
  } else {
    minIndex = clickIndex
    maxIndex = clickIndex
  }
  minSelectIndex.value = minIndex
  maxSelectIndex.value = maxIndex
}
//#endregion

//#region function
async function setSteamLocation() {
  const result = await window.steamApi.setSteamLocation()
  if (!result) {
    ElMessage({
      message: '路径设置失败，检查是否设置steam.exe以及WallpaperEngine是否安装',
      type: 'error'
    })
  }
}

function openDialog() {
  // const result = await window.wallpaperApi
}

function getWallpaperDatas() {
  isSearching.value = true
  window.wallpaperApi
    .getWallpaperDatas(
      searchRootPath.value,
      null,
      // ref数组都是Proxy类型,引用类型无法ipc传输
      // 再用通用的一句话来说，无法传输带有方法的类
      // 不然会报clone啥的错
      null
      // JSON.parse(JSON.stringify(searchSelected.value))
    )
    .then((wallpaperDatas) => {
      isSearching.value = false
      ElMessage({
        showClose: true,
        message: '获取 ' + wallpaperDatas.length + ' 个壁纸信息',
        type: 'success'
      })
      wallpaperDatas.map((wallpaperData) => {
        wallpaperData.type = wallpaperData.type.toLowerCase()
      })
      refWallpaperDatas.value = wallpaperDatas
      // 清空数组
      searchOptions.splice(0)
      // 遍历wallpaperDatas并将其中的type不重复地存放到searchOptions
      const newSearchOptions: string[] = []
      wallpaperDatas.map((wallpaperData) => {
        if (newSearchOptions.indexOf(wallpaperData.type) < 0) {
          newSearchOptions.push(wallpaperData.type)
        }
      })
      newSearchOptions.map((newSearchOption) => {
        searchOptions.push({ label: newSearchOption, value: newSearchOption })
      })
    })
}

function moveWallpaperDatas() {
  window.wallpaperApi.moveWallpaper(toRaw(refWallpaperDatas.value))
}
//#endregion
</script>

<style lang="less">
@import './assets/css/styles.less';
@import './assets/css//wallpaper-style.less';
</style>
