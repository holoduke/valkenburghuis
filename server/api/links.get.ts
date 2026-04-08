import type { ExternalLink } from '../utils/types'

const DEFAULT_LINKS: ExternalLink[] = [
  {
    id: 'lnk_1',
    label: 'Gietvloer vergelijking',
    url: 'https://holoduke.github.io/valkenburghuis/gietvloer-vergelijking.html',
    category: 'Gietvloeren',
  },
  {
    id: 'lnk_3',
    label: 'Schilders vergelijking',
    url: 'https://holoduke.github.io/valkenburghuis/schilders-vergelijking.html',
    category: 'Schilderwerk',
  },
]

export default defineEventHandler(async () => {
  return await readData<ExternalLink[]>('links.json', DEFAULT_LINKS)
})
