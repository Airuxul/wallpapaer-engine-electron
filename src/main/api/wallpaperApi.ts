import { dialog } from 'electron'
import { join } from 'path'
import * as fs from 'fs'
import { getDirPath, getFilePaths } from '../../common/utils'
import {
  STEAM_WORKSHOP_DIR,
  WALLPAPER_ENGINE_APP_ID,
  StoreKey,
  WallpaperData
} from '../../common/types'
import ElectronStore from 'electron-store'

export function hasSetSteamLocation(): boolean {
  const store = new ElectronStore()
  if (store.has(StoreKey.WALLPAPER_ENGINE_WS_PATH)) {
    const path = store.get(StoreKey.WALLPAPER_ENGINE_WS_PATH)?.toString()
    if (path != null && path.length > 0 && fs.existsSync(path)) return true
    store.delete(StoreKey.WALLPAPER_ENGINE_WS_PATH)
    console.log('path doesnt exist', path)
    return false
  } else {
    console.log('dont save path')
  }
  return false
}

export async function setSteamLocation() {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {
        name: 'Program',
        extensions: ['exe']
      }
    ]
  })
  if (result.canceled) return false
  const wallpaperWSPath = join(
    getDirPath(result.filePaths[0]),
    STEAM_WORKSHOP_DIR,
    WALLPAPER_ENGINE_APP_ID.toString()
  )
  if (fs.existsSync(wallpaperWSPath)) {
    const store = new ElectronStore()
    store.set(StoreKey.WALLPAPER_ENGINE_WS_PATH, wallpaperWSPath)
    return true
  } else {
    return false
  }
}

export function getWallpaperDatas(
  _event,
  rootPath: string,
  fromDate: Date,
  extensions: string[]
): WallpaperData[] {
  function modifyTimeFilter(_fpath: string, stats: fs.Stats): boolean {
    return stats.mtime > fromDate
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function extensionFilter(fpath: string, _stats: fs.Stats): boolean {
    for (const extension of extensions) {
      if (fpath.endsWith(extension)) return true
    }
    return false
  }
  const filePaths = getFilePaths(rootPath, extensionFilter, modifyTimeFilter)
  const wallpaperDatas: WallpaperData[] = []
  for (const fpath of filePaths) {
    wallpaperDatas.push({ path: fpath, title: 'defaultTitle' })
  }
  return wallpaperDatas
}
