import * as fs from 'fs'
import { getDirPath, getFileName, getFilePaths } from '../../common/utils'
import { WallpaperData } from '../../common/types'
import { WALLPAPER_CONFIG } from '../../common/const'
import logger from '../../common/logger'

export async function getWallpaperDatas(
  _event,
  rootPath: string,
  fromDate: Date | null,
  extensions: string[] | null
): Promise<WallpaperData[]> {
  function modifyTimeFilter(_fpath: string, stats: fs.Stats): boolean {
    if (fromDate == null) return true
    return stats.mtime > fromDate
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function extensionFilter(fpath: string, _stats: fs.Stats): boolean {
    if (extensions == null) return true
    for (const extension of extensions) {
      if (fpath.endsWith(extension)) return true
    }
    return false
  }
  const filePaths = getFilePaths(rootPath, extensionFilter, modifyTimeFilter)
  const wallpaperDatas: WallpaperData[] = []

  for (const filePath of filePaths) {
    if (getFileName(filePath) != WALLPAPER_CONFIG) {
      continue
    }
    const projectConfigStr = fs.readFileSync(filePath, 'utf-8')
    logger.debug(projectConfigStr)
    const projectConfig = JSON.parse(projectConfigStr)
    const projectDir = getDirPath(filePath)
    wallpaperDatas.push(
      new WallpaperData(
        projectDir + filePath,
        projectConfig.title,
        projectDir + projectConfig.preview,
        projectConfig.tags,
        projectConfig.workshopurl,
        projectConfig.description,
        projectConfig.type,
        fs.statSync(filePath).mtime
      )
    )
  }
  return wallpaperDatas
}

export function moveWallpapers(_event, wallpaperDatas: WallpaperData[]) {
  logger.debug("[moveWallpapers]")
  wallpaperDatas.forEach(wallpaperData => {
    logger.debug(wallpaperData)
    const oriPath = wallpaperData.path
    
  });
}
