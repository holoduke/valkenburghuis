interface SyncData {
  hash: string
  todos: any[]
  timeline: any[]
  costs: { bouwdepot: number; items: any[] }
}

export function useSync(
  onUpdate: (data: SyncData) => void,
  intervalMs = 10000,
) {
  let lastHash = ''
  let timer: ReturnType<typeof setInterval> | null = null
  let paused = false

  async function poll() {
    if (paused) return
    try {
      const data = await $fetch<SyncData>('/api/sync')
      if (data.hash !== lastHash) {
        lastHash = data.hash
        onUpdate(data)
      }
    } catch {
      // silent fail, retry next interval
    }
  }

  function pause() {
    paused = true
  }

  function resume() {
    paused = false
  }

  function setHash(hash: string) {
    lastHash = hash
  }

  function start() {
    poll()
    timer = setInterval(poll, intervalMs)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  return { start, stop, pause, resume, setHash, poll }
}
