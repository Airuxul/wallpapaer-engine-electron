import { dialog } from 'electron'

export async function getFolderPath(): Promise<string> {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  if (result.canceled) return ''
  return result.filePaths[0]
}

export async function getFilePath(): Promise<string> {
  const result = await dialog.showOpenDialog({
    properties: ['openFile']
  })
  if (result.canceled) return ''
  return result.filePaths[0]
}
