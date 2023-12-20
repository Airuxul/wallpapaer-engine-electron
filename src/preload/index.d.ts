export interface WallpaperApi {
  getWallpaperDatas(
    rootPath: string,
    fromDate: Date,
    extensions: string[]
  ): Promise<WallpaperData[]>
}
declare global {
  interface Window {
    wallpaperApi: WallpaperApi
  }
}
