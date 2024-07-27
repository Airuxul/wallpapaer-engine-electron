import { dialog } from 'electron'
import { join } from 'path'
import * as fs from 'fs'
import { getDirPath } from '../../common/utils'
import {
    STEAM_WORKSHOP_DIR,
    WALLPAPER_ENGINE_APP_ID,
    StoreKey
} from '../../common/const'
import ElectronStore from 'electron-store'

export function hasSetSteamLocation(): boolean {
    const store = new ElectronStore()
    if (store.has(StoreKey.WALLPAPER_ENGINE_WS_PATH)) {
        const path = store.get(StoreKey.WALLPAPER_ENGINE_WS_PATH)?.toString()
        if (path != null && path.length > 0 && fs.existsSync(path)) return true
        store.delete(StoreKey.WALLPAPER_ENGINE_WS_PATH)
        return false
    } else {
    }
    return false
}

export async function setSteamLocation() {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {
                name: 'Program',
                extensions: ['exe']
            }
        ]
    })
    if (result.canceled) return false
    const wallpaperWSPath = join(
        getDirPath(result.filePaths[0]),
        STEAM_WORKSHOP_DIR,
        WALLPAPER_ENGINE_APP_ID.toString()
    )
    if (fs.existsSync(wallpaperWSPath)) {
        const store = new ElectronStore()
        store.set(StoreKey.WALLPAPER_ENGINE_WS_PATH, wallpaperWSPath)
        return true
    } else {
        return false
    }
}