import { ipcMain } from 'electron'
import { SteamEvents, WallpaperEvents } from '../common/ipcEvents'
import { getWallpaperDatas, moveWallpapers } from './api/wallpaperApi'
import { setSteamLocation, hasSetSteamLocation } from './api/steamApi'

export function ipcRegister() {
  ipcMain.handle(SteamEvents.HAS_SET_STEAM_LOCATION, hasSetSteamLocation)
  ipcMain.handle(SteamEvents.SET_STEAM_LOCATION, setSteamLocation)
  ipcMain.handle(WallpaperEvents.GET_WALLPAPER_DATAS, getWallpaperDatas)
  ipcMain.on(WallpaperEvents.MOVE_WALLPAPERS, moveWallpapers)
  
}
