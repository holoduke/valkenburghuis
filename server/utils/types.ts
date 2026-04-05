export interface Todo {
  id: string
  title: string
  category: string
  completed: boolean
  createdAt: string
}

export interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  completed: boolean
}

export interface CostItem {
  id: string
  label: string
  budget: number
  spent: number
}

export interface CostsData {
  bouwdepot: number
  items: CostItem[]
}

export const CATEGORIES = [
  { id: 'aannemer', label: 'Aannemer', color: '#F97316' },
  { id: 'vloer', label: 'Vloer', color: '#8B5CF6' },
  { id: 'schilderwerk', label: 'Schilderwerk', color: '#EF4444' },
  { id: 'badkamer', label: 'Badkamer', color: '#06B6D4' },
  { id: 'keuken', label: 'Keuken', color: '#EC4899' },
  { id: 'interieur', label: 'Interieur', color: '#A855F7' },
  { id: 'tuin', label: 'Tuin', color: '#22C55E' },
  { id: 'overig', label: 'Overig', color: '#6B7280' },
] as const
