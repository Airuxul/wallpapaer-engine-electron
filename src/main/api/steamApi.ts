import { dialog } from 'electron'
// import ElectronStore from 'electron-store'
export function setSteamLocation() {
  dialog
    .showOpenDialog({
      properties: ['openFile'],
      filters: [
        {
          name: 'Program',
          extensions: ['exe']
        }
      ]
    })
    .then((result) => {
      if (result.canceled) return null
      console.log(result.filePaths[0])
      //   const store = new ElectronStore()
      //   store.set('steamLocation', result.filePaths[0])
      return true
    })
    .catch((err) => {
      console.log(err)
      return false
    })
}
