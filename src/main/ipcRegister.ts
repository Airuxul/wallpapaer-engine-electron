import { ipcMain } from 'electron'
import { WallpaperEvents, CommonEvents } from '../common/ipcEvents'
import {
  hasSetSteamLocation,
  setSteamLocation,
  getMovePath,
  setMovePath,
  getWallpaperDatas,
  moveWallpaperFiles
} from '../main/api/wallpaperApi'
import { getFolderPath } from '../main/api/commonApi'
export function ipcRegister() {
  // 设置steam位置找WallpaperEngine创意工坊路径
  ipcMain.handle(WallpaperEvents.HAS_SET_STEAM_LOCATION, hasSetSteamLocation)
  ipcMain.handle(WallpaperEvents.SET_STEAM_LOCATION, setSteamLocation)

  // 设置移动位置
  ipcMain.handle(WallpaperEvents.GET_MOVE_PATH, getMovePath)
  ipcMain.handle(WallpaperEvents.SET_MOVE_PATH, setMovePath)

  // 获取壁纸数据
  ipcMain.handle(WallpaperEvents.GET_WALLPAPER_DATAS, getWallpaperDatas)
  ipcMain.handle(WallpaperEvents.MOVE_WALLPAPER_FILES, moveWallpaperFiles)

  // 通用函数
  ipcMain.handle(CommonEvents.GET_FOLDER_PATH, getFolderPath)
  // ipcMain.handle(CommonEvents.GET_FILE_PATH, getFilePath)
}
