export const STEAM_EVENT_PRE = 'steam:'

export enum SteamEvents {
  SET_STEAM_LOCATION = STEAM_EVENT_PRE + 'setSteamLocation'
}

export const WALLPAPER_EVENT_PRE = 'wallpaper:'

export enum WallpaperEvents {
  GET_WALLPAPER_DATAS = WALLPAPER_EVENT_PRE + 'getWallpaperDatas'
}
