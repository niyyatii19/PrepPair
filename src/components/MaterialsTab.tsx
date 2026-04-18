import { useState, useMemo } from 'react'
import { Material, getMaterialsByCategory, searchMaterials, MaterialCategory } from '../lib/firebaseRoom'
import MaterialCard from './MaterialCard'

interface MaterialsTabProps {
  materials: Material[]
  currentUserId: string
  friendName: string
  onDelete: (materialId: string) => void
  onToggleHelpful: (materialId: string) => void
  showForm: boolean
}

const categories: MaterialCategory[] = ['dsa', 'system', 'mock', 'revision', 'other']
const categoryLabels: Record<MaterialCategory, string> = {
  dsa: 'DSA',
  system: 'System',
  mock: 'Mock',
  revision: 'Revision',
  other: 'Other',
}

const categoryColors: Record<MaterialCategory, string> = {
  dsa: '#FF6B6B',
  system: '#4ECDC4',
  mock: '#45B7D1',
  revision: '#F9A825',
  other: '#A78D58',
}

export default function MaterialsTab({
  materials,
  currentUserId,
  friendName,
  onDelete,
  onToggleHelpful,
  showForm,
}: MaterialsTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'all'>('all')

  const filteredMaterials = useMemo(() => {
    let result = materials

    // Filter by category
    if (selectedCategory !== 'all') {
      result = getMaterialsByCategory(result, selectedCategory as MaterialCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      result = searchMaterials(result, searchQuery)
    }

    // Sort by newest first
    return result.sort((a, b) => b.sharedAt - a.sharedAt)
  }, [materials, selectedCategory, searchQuery])

  // Count materials per category
  const categoryCounts = useMemo(() => {
    const counts: Record<MaterialCategory | 'all', number> = {
      all: materials.length,
      dsa: materials.filter((m) => m.category === 'dsa').length,
      system: materials.filter((m) => m.category === 'system').length,
      mock: materials.filter((m) => m.category === 'mock').length,
      revision: materials.filter((m) => m.category === 'revision').length,
      other: materials.filter((m) => m.category === 'other').length,
    }
    return counts
  }, [materials])

  return (
    <div className="materials-tab">
      {/* Search Bar */}
      <div className="materials-search-section">
        <input
          type="text"
          placeholder="🔍 Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="materials-search-input"
        />
      </div>

      {/* Category Filter */}
      <div className="materials-category-filter">
        <button
          className={`category-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All <span className="filter-badge">{categoryCounts.all}</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
            style={
              selectedCategory === cat ? { backgroundColor: categoryColors[cat] } : undefined
            }
          >
            {categoryLabels[cat]} <span className="filter-badge">{categoryCounts[cat]}</span>
          </button>
        ))}
      </div>

      {/* Materials List */}
      <div className="materials-list">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              currentUserId={currentUserId}
              friendName={friendName}
              onDelete={onDelete}
              onToggleHelpful={onToggleHelpful}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <div className="empty-state-text">
              {materials.length === 0
                ? 'No materials shared yet. Share one to get started!'
                : 'No materials match your search.'}
            </div>
          </div>
        )}
      </div>

      {/* Floating CTA if no materials and form is hidden */}
      {materials.length === 0 && !showForm && (
        <div className="materials-empty-cta">
          Start sharing study materials with your friend!
        </div>
      )}
    </div>
  )
}
