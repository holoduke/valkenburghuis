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

export const CATEGORIES = [
  { id: 'vloeren', label: 'Vloeren', color: '#8B5CF6' },
  { id: 'keuken', label: 'Keuken', color: '#EC4899' },
  { id: 'badkamer', label: 'Badkamer', color: '#06B6D4' },
  { id: 'tuin', label: 'Tuin', color: '#22C55E' },
  { id: 'elektra', label: 'Elektra', color: '#F59E0B' },
  { id: 'schilderwerk', label: 'Schilderwerk', color: '#EF4444' },
  { id: 'overig', label: 'Overig', color: '#6B7280' },
] as const
