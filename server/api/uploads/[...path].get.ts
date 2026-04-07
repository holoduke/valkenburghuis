import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || ''
  const dataDir = process.env.DATA_DIR || join(process.cwd(), 'data')
  const filepath = join(dataDir, 'uploads', path)

  if (!existsSync(filepath)) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }

  const data = await readFile(filepath)
  const ext = filepath.split('.').pop()?.toLowerCase()

  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }

  setResponseHeader(event, 'Content-Type', mimeTypes[ext || ''] || 'application/octet-stream')
  setResponseHeader(event, 'Content-Disposition', `inline; filename="${filepath.split('/').pop()}"`)

  return data
})
