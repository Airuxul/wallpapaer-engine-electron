import { contextBridge, ipcRenderer } from 'electron'
import { WallpaperEvents } from '../common/ipcEvents'

const wallpaperApi = {
  getWallpaperDatas: (rootPath: string, fromDate: Date, extensions: string[]) =>
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
