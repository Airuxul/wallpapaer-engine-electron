import * as fs from 'fs'
import { join } from 'path'
import { WallpaperData } from '../../common/types'

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
  console.log(rootPath)
  console.log(fromDate)
  console.log(extensions)
  const filePaths = getFilePaths(rootPath, extensionFilter, modifyTimeFilter)
  const wallpaperDatas: WallpaperData[] = []
  for (const fpath of filePaths) {
    wallpaperDatas.push({ path: fpath, title: 'defaultTitle' })
  }
  return wallpaperDatas
}

function getFilePaths(
  dirPath: string,
  fileFilter: ((path: string, stats: fs.Stats) => boolean) | null,
  dirFilter: ((path: string, stats: fs.Stats) => boolean) | null
) {
  const filePaths: string[] = []
  function internal_getFilePaths(path: string) {
    const files = fs.readdirSync(path)
    files.forEach((filename) => {
      const fpath = join(path, filename)
      const stat = fs.statSync(fpath)
      if (stat.isDirectory()) {
        if (dirFilter == null || dirFilter(fpath, stat)) {
          internal_getFilePaths(fpath)
        }
      }
      if (stat.isFile()) {
        if (fileFilter == null || fileFilter(fpath, stat)) {
          filePaths.push(fpath)
        }
      }
    })
  }
  internal_getFilePaths(dirPath)
  return filePaths
}
