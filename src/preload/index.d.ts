export interface CommonApi {
 
}

export interface SteamApi {
  hasSetSteamLocation(): Promise<boolean>
  setSteamLocation(): Promise<boolean>
}

export interface WallpaperApi {
  getWallpaperDatas(
    rootPath: string,
    fromDate: Date | null,
    extensions: string[] | null
  ): Promise<WallpaperData[]>
  moveWallpaper(wallpaperDatas: WallpaperData[])
}

declare global {
  interface Window {
    commonApi: CommonApi
    steamApi: SteamApi
    wallpaperApi: WallpaperApi
  }
}
