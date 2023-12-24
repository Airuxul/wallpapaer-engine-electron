import { ipcMain } from 'electron'
import { WallpaperEvents } from '../common/ipcEvents'
import { hasSetSteamLocation, setSteamLocation, getWallpaperDatas } from '../main/api/wallpaperApi'
export function ipcRegister() {
  ipcMain.handle(WallpaperEvents.HAS_SET_STEAM_LOCATION, hasSetSteamLocation)
  ipcMain.handle(WallpaperEvents.SET_STEAM_LOCATION, setSteamLocation)
  ipcMain.handle(WallpaperEvents.GET_WALLPAPER_DATAS, getWallpaperDatas)
}
