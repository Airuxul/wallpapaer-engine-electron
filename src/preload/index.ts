import { contextBridge, ipcRenderer } from 'electron'
import { WallpaperEvents } from '../common/ipcEvents'
import { WallpaperData } from '../common/types'

const wallpaperApi = {
  hasSetSteamLocation: (): Promise<boolean> =>
    ipcRenderer.invoke(WallpaperEvents.HAS_SET_STEAM_LOCATION),
  setSteamLocation: (): Promise<boolean> => ipcRenderer.invoke(WallpaperEvents.SET_STEAM_LOCATION),
  getWallpaperDatas: (
    rootPath: string,
    fromDate: Date,
    extensions: string[]
  ): Promise<WallpaperData[]> =>
    ipcRenderer.invoke(WallpaperEvents.GET_WALLPAPER_DATAS, rootPath, fromDate, extensions)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('wallpaperApi', wallpaperApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.wallpaperApi = wallpaperApi
}
