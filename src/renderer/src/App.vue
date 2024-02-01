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
          <el-col :span="6">
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
        </el-row>
      </div>
      <div>
        <el-scrollbar :style="el_main_style" always>
          <el-row>
            <el-col
              v-for="wallpaperData in refWallpaperDatas"
              :key="wallpaperData"
              :span="4"
              style="padding: 5px"
            >
              <el-card>
                <img :src="getElectronImgSrc(wallpaperData.preview)" class="card-image" />
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
    <div style="width: 20%; background-color: black"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FolderOpened, CircleCheckFilled, WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { WallpaperData } from '../../common/types'
import { MILLISECONDS_IN_DAY, PROTOCOL_FILE_HEAD } from '../../common/const'
// search
const searchRootPath = ref('E:\\Steam\\steamapps\\workshop\\content\\431960')
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

// data
const refWallpaperDatas = ref<WallpaperData[]>([])

// main height
const el_main_style = ref({
  height: ''
})

// movie
const moveTargetPath = ref('E:\\new')

//#region html hook
window.onresize = resetElMainStyle
//#endregion

//#region vue lifecycle hooks
onMounted(async () => {
  getWallpaperDatas()
  hasSteamRootSet.value = await window.wallpaperApi.hasSetSteamLocation()
  resetElMainStyle()
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

function resetElMainStyle() {
  el_main_style.value.height = (window.innerHeight - 120).toString() + 'px'
}

function openDialog() {
  console.log('nihao')
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

function getElectronImgSrc(localPath: string) {
  return PROTOCOL_FILE_HEAD + ':///' + localPath
}
//#endregion
</script>

<style lang="less">
@import './assets/css/styles.less';
</style>
