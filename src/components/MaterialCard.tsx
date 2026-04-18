import { Material, getExpiryStatus, formatExpiryDate } from '../lib/firebaseRoom'

interface MaterialCardProps {
  material: Material
  currentUserId: string
  friendName: string
  onDelete: (materialId: string) => void
  onToggleHelpful: (materialId: string) => void
}

type MaterialCategory = 'dsa' | 'system' | 'mock' | 'revision' | 'other'

const categoryColors: Record<MaterialCategory, string> = {
  dsa: '#FF6B6B',
  system: '#4ECDC4',
  mock: '#45B7D1',
  revision: '#F9A825',
  other: '#A78D58',
}

const categoryLabels: Record<MaterialCategory, string> = {
  dsa: 'DSA',
  system: 'System',
  mock: 'Mock',
  revision: 'Revision',
  other: 'Other',
}

export default function MaterialCard({
  material,
  currentUserId,
  friendName,
  onDelete,
  onToggleHelpful,
}: MaterialCardProps) {
  const isSharedByCurrentUser = material.sharedBy === currentUserId
  const markedHelpfulBy = Array.isArray(material.markedHelpfulBy) ? material.markedHelpfulBy : []
  const isMarkedHelpful = markedHelpfulBy.includes(currentUserId)
  const sharedByName = isSharedByCurrentUser ? 'You' : friendName
  const contentPreview =
    material.content && material.content.length > 100
      ? material.content.substring(0, 100) + '...'
      : material.content || ''

  const categoryColor = categoryColors[material.category as MaterialCategory]
  const categoryLabel = categoryLabels[material.category as MaterialCategory]
  const expiryStatus = getExpiryStatus(material)
  const isExpiringSoon = expiryStatus === 'expiring-soon'
  const expiryDate = formatExpiryDate(material.expiresAt || Date.now())

  return (
    <div className="material-card">
      <div className="material-header">
        <div className="material-title-section">
          <h3 className="material-title">{material.title}</h3>
          <div
            className="material-category-tag"
            style={{ backgroundColor: categoryColor }}
          >
            {categoryLabel}
          </div>
        </div>
        <div className="material-shared-by">{sharedByName}</div>
      </div>

      {material.type === 'link' ? (
        <div className="material-link-content">
          <a href={material.content} target="_blank" rel="noopener noreferrer">
            {contentPreview}
          </a>
        </div>
      ) : (
        <div className="material-text-content">{contentPreview}</div>
      )}

      <div className="material-footer">
        <button
          className={`material-helpful-btn ${isMarkedHelpful ? 'marked' : ''}`}
          onClick={() => onToggleHelpful(material.id)}
          title="Mark as helpful"
        >
          👍 {markedHelpfulBy.length}
        </button>

        {isSharedByCurrentUser && (
          <button
            className="material-delete-btn"
            onClick={() => onDelete(material.id)}
            title="Delete this material"
          >
            🗑️
          </button>
        )}
      </div>

      {isExpiringSoon && (
        <div style={{
          background: 'rgba(241, 165, 53, 0.12)',
          border: '1px solid rgba(241, 165, 53, 0.3)',
          borderRadius: '6px',
          padding: '8px 10px',
          marginTop: '8px',
          fontSize: '0.75rem',
          color: '#f1a535',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          ⏰ Expires {expiryDate}
        </div>
      )}
    </div>
  )
}
