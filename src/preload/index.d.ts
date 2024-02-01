export interface SteamApi {
  setSteamLocation(): Promise<boolean>
}
export interface WallpaperApi {
  hasSetSteamLocation(): Promise<boolean>
  setSteamLocation(): Promise<boolean>
  getWallpaperDatas(
    rootPath: string,
    fromDate: Date | null,
    extensions: string[] | null
  ): Promise<WallpaperData[]>
}
declare global {
  interface Window {
    steamApi: SteamApi
    wallpaperApi: WallpaperApi
  }
}
