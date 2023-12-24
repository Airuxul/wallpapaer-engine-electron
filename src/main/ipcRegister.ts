import { ipcMain } from 'electron'
import { SteamEvents, WallpaperEvents } from '../common/ipcEvents'
import { setSteamLocation } from './api/steamApi'
import { getWallpaperDatas } from '../main/api/wallpaperApi'
export function ipcRegister() {
  ipcMain.handle(SteamEvents.SET_STEAM_LOCATION, setSteamLocation)
  ipcMain.handle(WallpaperEvents.GET_WALLPAPER_DATAS, getWallpaperDatas)
}
