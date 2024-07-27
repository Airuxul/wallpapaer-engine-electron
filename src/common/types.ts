export class WallpaperData {
  path: string
  title: string
  preview: string
  tags: string[]
  workshopUrl: string
  description: string
  type: string
  lastModifyDate: Date
  constructor(path, title, preview, tags, workshopUrl, description, type, lastModifyDate) {
    this.path = path
    this.title = title
    this.preview = preview
    this.tags = tags
    this.workshopUrl = workshopUrl
    this.description = description
    this.type = type
    this.lastModifyDate = lastModifyDate
  }
}
