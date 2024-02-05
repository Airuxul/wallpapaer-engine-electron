import { PROTOCOL_FILE_HEAD } from '@common/const'

export function getElectronImgSrc(localPath: string) {
  return PROTOCOL_FILE_HEAD + ':///' + localPath
}
