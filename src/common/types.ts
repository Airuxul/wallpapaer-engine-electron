export const MILLISECONDS_IN_DAY = 86400000
export const STEAM_WORKSHOP_DIR = 'steamapps\\workshop\\content'
export const WALLPAPER_ENGINE_APP_ID = 431960
export const WALLPAPER_CONFIG = 'project.json'

export interface WallpaperData {
  path: string
  title: string
  preview: string
}

export enum StoreKey {
  WALLPAPER_ENGINE_WS_PATH = 'wallpaperWSPath',
  MOVE_PATH = 'moveFolderPath'
}
