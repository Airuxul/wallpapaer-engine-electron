import * as fs from 'fs'
import { join } from 'path'

export function getDirPath(filePath: string) {
  return filePath.substring(0, filePath.lastIndexOf('\\')) + '\\'
}

export function getFileName(filePath: string) {
  return filePath.substring(filePath.lastIndexOf('\\') + 1)
}

export function getFilePaths(
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
