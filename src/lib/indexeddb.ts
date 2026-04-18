// Store and sync data with IndexedDB
const DB_NAME = 'pair-prep-db'
const DB_VERSION = 1

export interface Goal {
  id: string
  text: string
  done: boolean
  createdAt: number
  completedAt?: number
}

export type MaterialCategory = 'dsa' | 'system' | 'mock' | 'revision' | 'other'
export type MaterialType = 'link' | 'text'

export interface Material {
  id: string
  type: MaterialType
  title: string
  content: string
  category: MaterialCategory
  sharedBy: string
  sharedAt: number
  markedHelpfulBy: string[]
}

interface DBSchema {
  goals: Goal
  materials: Material
  synced: { key: string; timestamp: number }
}

let db: IDBDatabase | null = null

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      if (!database.objectStoreNames.contains('goals')) {
        database.createObjectStore('goals', { keyPath: 'id' })
      }
      if (!database.objectStoreNames.contains('materials')) {
        database.createObjectStore('materials', { keyPath: 'id' })
      }
      if (!database.objectStoreNames.contains('synced')) {
        database.createObjectStore('synced', { keyPath: 'key' })
      }
    }

    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }
  })
}

const getDB = async (): Promise<IDBDatabase> => {
  if (db) return db
  return initDB()
}

// Goals operations
export const saveGoal = async (goal: Goal): Promise<void> => {
  const database = await getDB()
  const tx = database.transaction('goals', 'readwrite')
  const store = tx.objectStore('goals')
  return new Promise((resolve, reject) => {
    const request = store.put(goal)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export const getGoals = async (): Promise<Goal[]> => {
  const database = await getDB()
  const tx = database.transaction('goals', 'readonly')
  const store = tx.objectStore('goals')
  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export const getGoalsForDate = async (date: string): Promise<Goal[]> => {
  const goals = await getGoals()
  return goals.filter(g => {
    const goalDate = new Date(g.createdAt).toISOString().split('T')[0]
    return goalDate === date
  })
}

export const deleteGoal = async (goalId: string): Promise<void> => {
  const database = await getDB()
  const tx = database.transaction('goals', 'readwrite')
  const store = tx.objectStore('goals')
  return new Promise((resolve, reject) => {
    const request = store.delete(goalId)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

// Materials operations
export const saveMaterial = async (material: Material): Promise<void> => {
  const database = await getDB()
  const tx = database.transaction('materials', 'readwrite')
  const store = tx.objectStore('materials')
  return new Promise((resolve, reject) => {
    const request = store.put(material)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export const getMaterials = async (): Promise<Material[]> => {
  const database = await getDB()
  const tx = database.transaction('materials', 'readonly')
  const store = tx.objectStore('materials')
  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export const deleteMaterialLocal = async (materialId: string): Promise<void> => {
  const database = await getDB()
  const tx = database.transaction('materials', 'readwrite')
  const store = tx.objectStore('materials')
  return new Promise((resolve, reject) => {
    const request = store.delete(materialId)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

// Sync tracking
export const markSynced = async (key: string): Promise<void> => {
  const database = await getDB()
  const tx = database.transaction('synced', 'readwrite')
  const store = tx.objectStore('synced')
  return new Promise((resolve, reject) => {
    const request = store.put({ key, timestamp: Date.now() })
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export const isSynced = async (key: string): Promise<boolean> => {
  const database = await getDB()
  const tx = database.transaction('synced', 'readonly')
  const store = tx.objectStore('synced')
  return new Promise((resolve, reject) => {
    const request = store.get(key)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(!!request.result)
  })
}
