import { dialog } from 'electron'
import { join } from 'path'
import * as fs from 'fs'
import { getDirPath, getFilePaths } from '../../common/utils'
import {
  STEAM_WORKSHOP_DIR,
  WALLPAPER_ENGINE_APP_ID,
  WALLPAPER_CONFIG,
  StoreKey,
  WallpaperData
} from '../../common/types'
import ElectronStore from 'electron-store'

function getStorePath(pathKey: string): string {
  const store = new ElectronStore()
  if (store.has(pathKey)) {
    const path = store.get(pathKey)?.toString()
    if (path != null && path.length > 0 && fs.existsSync(path)) return path
    store.delete(pathKey)
    return ''
  }
  return ''
}

export function hasSetSteamLocation(): boolean {
  const path = getStorePath(StoreKey.WALLPAPER_ENGINE_WS_PATH)
  return path != null && path.length > 0 && fs.existsSync(path)
}

export async function setSteamLocation(): Promise<boolean> {
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

// 暴露出去的接口要传参数需要第一个参数为_event
export function setMovePath(_event, path: string): boolean {
  if (path == null || path.length == 0 || !fs.existsSync(path)) {
    return false
  }
  const store = new ElectronStore()
  store.set(StoreKey.MOVE_PATH, path)
  return true
}

export function getMovePath(): string {
  return getStorePath(StoreKey.MOVE_PATH)
}

export async function getWallpaperDatas(
  _event,
  fromDate: Date,
  extensions: string[]
): Promise<WallpaperData[]> {
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
  const rootPath = getStorePath(StoreKey.WALLPAPER_ENGINE_WS_PATH)
  const filePaths = getFilePaths(rootPath, extensionFilter, modifyTimeFilter)
  const wallpaperDatas: WallpaperData[] = []

  for (const fpath of filePaths) {
    const folderPath = getDirPath(fpath)
    const projectConfigStr = await fs.readFileSync(join(folderPath, WALLPAPER_CONFIG), 'utf-8')
    const projectConfig = JSON.parse(projectConfigStr)
    const previewPath = 'local-image:///' + join(folderPath, projectConfig.preview)
    wallpaperDatas.push({
      path: fpath,
      title: projectConfig.title,
      preview: previewPath
    })
  }
  return wallpaperDatas
}
