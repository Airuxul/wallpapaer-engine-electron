export const COMMON_EVENT_PRE = 'common:'
export enum CommonEvent {
  SET_CONFIG = COMMON_EVENT_PRE + 'setConfig',
  GET_CONFIG = COMMON_EVENT_PRE + 'getConfig',
}

export const STEAM_EVENT_PRE = 'steam:'
export enum SteamEvents {
  SET_STEAM_LOCATION = STEAM_EVENT_PRE + 'setSteamLocation',
  HAS_SET_STEAM_LOCATION = STEAM_EVENT_PRE + 'hasSetSteamLocation',
}

export const WALLPAPER_EVENT_PRE = 'wallpaper:'
export enum WallpaperEvents {
  GET_WALLPAPER_DATAS = WALLPAPER_EVENT_PRE + 'getWallpaperDatas',
  MOVE_WALLPAPERS = WALLPAPER_EVENT_PRE + 'moveWallpapers',
  ON_MOVE_WALLPAPER_FINISH = WALLPAPER_EVENT_PRE + 'onWallpaperMoveFinish',
}
