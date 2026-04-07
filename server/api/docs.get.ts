import { readdir } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  try {
    const docsDir = join(process.cwd(), '.output', 'public', 'docs')
    const files = await readdir(docsDir)
    return files.filter((f) => f.endsWith('.pdf')).sort()
  } catch {
    return []
  }
})
