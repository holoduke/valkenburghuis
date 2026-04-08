import type { ExternalLink } from '../utils/types'

const DEFAULT_LINKS: ExternalLink[] = [
  {
    id: 'lnk_1',
    label: 'Gietvloer vergelijking',
    url: 'https://holoduke.github.io/valkenburghuis/gietvloer-vergelijking.html',
    category: 'Gietvloeren',
  },
  {
    id: 'lnk_2',
    label: 'Gietvloer vergelijking Leiden',
    url: 'https://holoduke.github.io/valkenburghuis/gietvloer-vergelijking-leiden.html',
    category: 'Gietvloeren',
  },
  {
    id: 'lnk_3',
    label: 'Schilders vergelijking',
    url: 'https://holoduke.github.io/valkenburghuis/schilders-vergelijking.html',
    category: 'Schilderwerk',
  },
  {
    id: 'lnk_4',
    label: 'Schilders vergelijking Leiden',
    url: 'https://holoduke.github.io/valkenburghuis/schilders-vergelijking-leiden.html',
    category: 'Schilderwerk',
  },
]

export default defineEventHandler(async () => {
  return await readData<ExternalLink[]>('links.json', DEFAULT_LINKS)
})
