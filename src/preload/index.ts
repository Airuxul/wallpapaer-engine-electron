import { contextBridge, ipcRenderer } from 'electron'
import { SteamEvents, WallpaperEvents } from '../common/ipcEvents'
import { WallpaperData } from '../common/types'

// 文件移动
const commonApi = {

}

const steamApi = {
  hasSetSteamLocation: (): Promise<boolean> =>
    ipcRenderer.invoke(SteamEvents.HAS_SET_STEAM_LOCATION),
  setSteamLocation: (): Promise<boolean> =>
    ipcRenderer.invoke(SteamEvents.SET_STEAM_LOCATION),
}

const wallpaperApi = {
  getWallpaperDatas: (
    rootPath: string,
    fromDate: Date | null,
    extensions: string[] | null
  ): Promise<WallpaperData[]> =>
    ipcRenderer.invoke(WallpaperEvents.GET_WALLPAPER_DATAS, rootPath, fromDate, extensions),
  moveWallpaper: (wallpaperDatas: WallpaperData[]) =>
    ipcRenderer.send(WallpaperEvents.MOVE_WALLPAPERS, wallpaperDatas),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('commonApi', commonApi)
    contextBridge.exposeInMainWorld('steamApi', steamApi)
    contextBridge.exposeInMainWorld('wallpaperApi', wallpaperApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.commonApi = commonApi
  // @ts-ignore (define in dts)
  window.steamApi = steamApi
  // @ts-ignore (define in dts)
  window.wallpaperApi = wallpaperApi
}
