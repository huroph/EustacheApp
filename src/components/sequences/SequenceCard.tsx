// src/components/sequences/SequenceCard.tsx
import Badge from '@/components/ui/Badge'

interface SequenceCardProps {
  sequence: {
    id: string
    code: string
    title: string
    status: string
    colorId: string
    location: string
    type: string
    effet: string
    summary?: string
    createdAt?: Date
  }
  onClick?: () => void
  isSelected?: boolean
  onEdit?: (sequence: any) => void
  onDelete?: (sequenceId: string) => void
}

export default function SequenceCard({ 
  sequence, 
  onClick, 
  isSelected = false,
  onEdit,
  onDelete 
}: SequenceCardProps) {
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(sequence)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Supprimer cette séquence ?')) {
      onDelete?.(sequence.id)
    }
  }

  const getColorClass = (colorId: string) => {
    switch (colorId) {
      case 'blue': return 'bg-blue-500'
      case 'green': return 'bg-green-500'
      case 'red': return 'bg-red-500'
      case 'purple': return 'bg-purple-500'
      case 'orange': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div
      onClick={onClick}
      className={`w-full p-4 text-left rounded-lg border transition-colors cursor-pointer ${
        isSelected
          ? 'bg-slate-700 border-blue-500'
          : 'bg-slate-800 border-slate-600 hover:bg-slate-700'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getColorClass(sequence.colorId)}`}></div>
          <span className="text-sm font-mono text-gray-300">{sequence.code}</span>
          <Badge>{sequence.type}</Badge>
          <Badge>{sequence.effet}</Badge>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleEdit}
            className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
            title="Modifier"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
            title="Supprimer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <h3 className="font-medium text-white mb-2">{sequence.title}</h3>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{sequence.status}</span>
        {sequence.createdAt && (
          <span className="text-xs text-gray-500">
            {new Date(sequence.createdAt).toLocaleDateString('fr-FR')}
          </span>
        )}
      </div>
      
      {sequence.summary && (
        <p className="text-sm text-gray-400 line-clamp-2 mt-2">{sequence.summary}</p>
      )}
    </div>
  )
}