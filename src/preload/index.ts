import { contextBridge, ipcRenderer } from 'electron'
import { WallpaperEvents, CommonEvents } from '../common/ipcEvents'
import { WallpaperData } from '../common/types'

const wallpaperApi = {
  hasSetSteamLocation: (): Promise<boolean> =>
    ipcRenderer.invoke(WallpaperEvents.HAS_SET_STEAM_LOCATION),
  setSteamLocation: (): Promise<boolean> => ipcRenderer.invoke(WallpaperEvents.SET_STEAM_LOCATION),
  getMovePath: (): Promise<string> => ipcRenderer.invoke(WallpaperEvents.GET_MOVE_PATH),
  setMovePath: (movePath: string): Promise<boolean> =>
    ipcRenderer.invoke(WallpaperEvents.SET_MOVE_PATH, movePath),
  getWallpaperDatas: (fromDate: Date, extensions: string[]): Promise<WallpaperData[]> =>
    ipcRenderer.invoke(WallpaperEvents.GET_WALLPAPER_DATAS, fromDate, extensions)
}

const commonApi = {
  getFolderPath: (): Promise<string> => ipcRenderer.invoke(CommonEvents.GET_FOLDER_PATH)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('wallpaperApi', wallpaperApi)
    contextBridge.exposeInMainWorld('commonApi', commonApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.wallpaperApi = wallpaperApi
  // @ts-ignore (define in dts)
  window.commonApi = commonApi
}
