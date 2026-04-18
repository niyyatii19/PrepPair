import { useState } from 'react'
import { MaterialType, MaterialCategory } from '../lib/firebaseRoom'

interface MaterialFormProps {
  onSubmit: (material: {
    type: MaterialType
    title: string
    content: string
    category: MaterialCategory
  }) => void
  isLoading: boolean
}

const categories: MaterialCategory[] = ['dsa', 'system', 'mock', 'revision', 'other']
const categoryLabels: Record<MaterialCategory, string> = {
  dsa: 'DSA',
  system: 'System',
  mock: 'Mock',
  revision: 'Revision',
  other: 'Other',
}

export default function MaterialForm({ onSubmit, isLoading }: MaterialFormProps) {
  const [materialType, setMaterialType] = useState<MaterialType>('link')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<MaterialCategory>('dsa')
  const [error, setError] = useState('')

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (!content.trim()) {
      setError(materialType === 'link' ? 'URL is required' : 'Content is required')
      return
    }

    if (materialType === 'link' && !validateUrl(content.trim())) {
      setError('Please enter a valid URL (e.g., https://example.com)')
      return
    }

    if (title.length > 100) {
      setError('Title must be 100 characters or less')
      return
    }

    if (content.length > 500) {
      setError('Content must be 500 characters or less')
      return
    }

    onSubmit({
      type: materialType,
      title: title.trim(),
      content: content.trim(),
      category,
    })

    // Reset form
    setTitle('')
    setContent('')
    setMaterialType('link')
    setCategory('dsa')
  }

  return (
    <form className="material-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <label className="form-label">Material Type</label>
        <div className="material-type-toggle">
          <button
            type="button"
            className={`type-btn ${materialType === 'link' ? 'active' : ''}`}
            onClick={() => setMaterialType('link')}
          >
            🔗 Link
          </button>
          <button
            type="button"
            className={`type-btn ${materialType === 'text' ? 'active' : ''}`}
            onClick={() => setMaterialType('text')}
          >
            📝 Text
          </button>
        </div>
      </div>

      <div className="form-section">
        <label htmlFor="material-title" className="form-label">
          Title <span className="required">*</span>
        </label>
        <input
          id="material-title"
          type="text"
          placeholder="Enter material title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="form-input"
        />
        <div className="char-count">{title.length}/100</div>
      </div>

      <div className="form-section">
        <label htmlFor="material-content" className="form-label">
          {materialType === 'link' ? 'URL' : 'Content'} <span className="required">*</span>
        </label>
        {materialType === 'link' ? (
          <input
            id="material-content"
            type="url"
            placeholder="https://example.com"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-input"
          />
        ) : (
          <textarea
            id="material-content"
            placeholder="Enter text or notes..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
            className="form-input"
            style={{ resize: 'vertical', minHeight: '100px' }}
          />
        )}
        <div className="char-count">{content.length}/500</div>
      </div>

      <div className="form-section">
        <label htmlFor="material-category" className="form-label">
          Category
        </label>
        <select
          id="material-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as MaterialCategory)}
          className="form-input"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {categoryLabels[cat]}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="form-error">{error}</div>}

      <button
        type="submit"
        className="btn-primary"
        disabled={isLoading}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        {isLoading ? 'Sharing...' : 'Share Material'}
      </button>
    </form>
  )
}
