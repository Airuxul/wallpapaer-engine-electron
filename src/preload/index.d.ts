export interface WallpaperApi {
  hasSetSteamLocation(): Promise<boolean>
  setSteamLocation(): Promise<boolean>
  getMovePath(): Promise<string>
  setMovePath(movePath: string): Promise<boolean>
  getWallpaperDatas(fromDate: Date, extensions: string[]): Promise<WallpaperData[]>
}

export interface CommonApi {
  getFolderPath(): Promise<string>
}

declare global {
  interface Window {
    commonApi: CommonApi
    wallpaperApi: WallpaperApi
  }
}

export {}
