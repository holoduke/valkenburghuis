import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), 'data')

async function ensureDir(): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

export async function readData<T>(file: string, fallback: T): Promise<T> {
  await ensureDir()
  const path = join(DATA_DIR, file)
  try {
    const content = await readFile(path, 'utf-8')
    return JSON.parse(content) as T
  } catch {
    return fallback
  }
}

export async function writeData<T>(file: string, data: T): Promise<void> {
  await ensureDir()
  const path = join(DATA_DIR, file)
  await writeFile(path, JSON.stringify(data, null, 2), 'utf-8')
}
