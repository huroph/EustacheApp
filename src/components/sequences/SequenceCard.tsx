// src/components/sequences/SequenceCard.tsx
import Badge from '@/components/ui/Badge'

interface SequenceCardProps {
  sequence: {
    id: string
    code: string
    tags: string[]
    title: string
    time: string
    summary?: string
  }
  onClick?: () => void
  isSelected?: boolean
}

export default function SequenceCard({ sequence, onClick, isSelected = false }: SequenceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 text-left rounded-lg border transition-colors ${
        isSelected
          ? 'bg-primary-100 border-primary-300'
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-mono text-gray-600">{sequence.code}</span>
          {sequence.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <span className="text-xs text-gray-500">{sequence.time}</span>
      </div>
      
      <h3 className="font-medium text-gray-900 mb-2">{sequence.title}</h3>
      
      {sequence.summary && (
        <p className="text-sm text-gray-600 line-clamp-2">{sequence.summary}</p>
      )}
    </button>
  )
}