export const WALLPAPER_EVENT_PRE = 'wallpaper:'

export enum WallpaperEvents {
  SET_STEAM_LOCATION = WALLPAPER_EVENT_PRE + 'setSteamLocation',
  HAS_SET_STEAM_LOCATION = WALLPAPER_EVENT_PRE + 'hasSetSteamLocation',
  GET_MOVE_PATH = WALLPAPER_EVENT_PRE + 'getMovePath',
  SET_MOVE_PATH = WALLPAPER_EVENT_PRE + 'setMovePath',
  GET_WALLPAPER_DATAS = WALLPAPER_EVENT_PRE + 'getWallpaperDatas'
}

export const CONST_EVENT_PRE = 'common:'

export enum CommonEvents {
  GET_FOLDER_PATH = CONST_EVENT_PRE + 'getFolderPath',
  GET_FILE_PATH = CONST_EVENT_PRE + 'getFilePath'
}
