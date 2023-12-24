import { contextBridge, ipcRenderer } from 'electron'
import { SteamEvents, WallpaperEvents } from '../common/ipcEvents'
import { WallpaperData } from '../common/types'

const steamApi = {
  getSteamGameDatas: (): Promise<boolean> => ipcRenderer.invoke(SteamEvents.SET_STEAM_LOCATION)
}

const wallpaperApi = {
  getWallpaperDatas: (
    rootPath: string,
    fromDate: Date,
    extensions: string[]
  ): Promise<WallpaperData[]> =>
    ipcRenderer.invoke(WallpaperEvents.GET_WALLPAPER_DATAS, rootPath, fromDate, extensions)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('steamApi', steamApi)
    contextBridge.exposeInMainWorld('wallpaperApi', wallpaperApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.steamApi = steamApi
  // @ts-ignore (define in dts)
  window.wallpaperApi = wallpaperApi
}
