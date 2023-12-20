import { ipcMain } from 'electron'
import { WallpaperEvents } from '../common/ipcEvents'
import { getWallpaperDatas } from '../main/api/wallpaperApi'
export function ipcRegister() {
  ipcMain.handle('ping', () => {
    console.log('ping')
  })
  ipcMain.handle(WallpaperEvents.GET_WALLPAPER_DATAS, getWallpaperDatas)

  ipcMain.eventNames().forEach((eventName) => {
    console.log(eventName)
  })
}
