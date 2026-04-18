import { database } from './firebase'
import { ref, set, onValue, remove, update, push } from 'firebase/database'

/**
 * Firebase room-based database structure:
 * /rooms/{roomCode}/
 *   ├── users/
 *   │   ├── {userId1}/
 *   │   │   ├── name
 *   │   │   ├── role (you/friend)
 *   │   │   └── updatedAt
 *   │   └── {userId2}/...
 *   ├── goals/
 *   │   ├── {goalId}/
 *   │   │   ├── userId
 *   │   │   ├── text
 *   │   │   ├── category
 *   │   │   ├── done
 *   │   │   ├── createdAt
 *   │   │   └── completedAt
 *   └── materials/
 *       ├── {materialId}/
 *       │   ├── type (link|text)
 *       │   ├── title
 *       │   ├── content
 *       │   ├── category
 *       │   ├── sharedBy
 *       │   ├── sharedAt
 *       │   └── markedHelpfulBy (array)
 */

// ─── Types ───
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

// ─── Users ───
export const registerUserInRoom = async (roomCode: string, userId: string, userData: any) => {
  const userRef = ref(database, `rooms/${roomCode}/users/${userId}`)
  return set(userRef, {
    ...userData,
    updatedAt: Date.now(),
  })
}

export const getUsersInRoom = (roomCode: string, callback: (users: any) => void) => {
  const usersRef = ref(database, `rooms/${roomCode}/users`)
  const unsubscribe = onValue(
    usersRef,
    (snapshot) => {
      try {
        const data = snapshot.val() || {}
        const usersWithId = Object.entries(data).reduce((acc, [userId, userData]: [string, any]) => {
          acc[userId] = {
            ...userData,
            id: userId,
          }
          return acc
        }, {} as any)
        callback(usersWithId)
      } catch (error) {
        console.error('Error processing users:', error)
        callback({})
      }
    },
    (error) => {
      console.error('Error listening to users:', error)
      callback({})
    }
  )
  return unsubscribe
}

// ─── Goals ───
export const addGoalToRoom = async (roomCode: string, userId: string, goal: any) => {
  const goalsRef = ref(database, `rooms/${roomCode}/goals`)
  const newGoalRef = push(goalsRef)
  return set(newGoalRef, {
    ...goal,
    userId,
    createdAt: Date.now(),
  })
}

export const listenToRoomGoals = (roomCode: string, callback: (goals: any[]) => void) => {
  const goalsRef = ref(database, `rooms/${roomCode}/goals`)
  const unsubscribe = onValue(
    goalsRef,
    (snapshot) => {
      try {
        const data = snapshot.val() || {}
        const goalsArray = Object.entries(data).map(([id, goal]: [string, any]) => ({
          id,
          ...goal,
        }))
        callback(goalsArray)
      } catch (error) {
        console.error('Error processing goals:', error)
        callback([])
      }
    },
    (error) => {
      console.error('Error listening to goals:', error)
      callback([])
    }
  )
  return unsubscribe
}

export const toggleGoalDone = async (roomCode: string, goalId: string, done: boolean) => {
  const goalRef = ref(database, `rooms/${roomCode}/goals/${goalId}`)
  return update(goalRef, {
    done,
    completedAt: done ? Date.now() : null,
  })
}

export const deleteGoal = async (roomCode: string, goalId: string) => {
  const goalRef = ref(database, `rooms/${roomCode}/goals/${goalId}`)
  return remove(goalRef)
}

// ─── Streak calculation ───
export const calculateStreak = (goals: any[], userId: string) => {
  if (!goals.length) return 0

  const userGoals = goals.filter((g: any) => g.userId === userId)
  const today = new Date()
  let streak = 0

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    const dateStr = checkDate.toISOString().split('T')[0]

    const dayGoals = userGoals.filter(
      (g: any) => new Date(g.createdAt).toISOString().split('T')[0] === dateStr
    )
    const allDone = dayGoals.length > 0 && dayGoals.every((g: any) => g.done)

    if (allDone) {
      streak++
    } else if (dayGoals.length > 0) {
      break
    }
  }

  return streak
}

// ─── Stats ───
export const getWeekStatsForUser = (goals: any[], userId: string) => {
  if (!userId) return {}
  const stats: any = {}
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    const dayGoals = goals.filter(
      (g: any) =>
        g.userId === userId && new Date(g.createdAt).toISOString().split('T')[0] === dateStr
    )
    const completed = dayGoals.filter((g: any) => g.done).length

    stats[dateStr] = {
      total: dayGoals.length,
      completed,
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
    }
  }

  return stats
}

// Calculate total completed goals for a user (all time)
export const getTotalCompletedGoals = (goals: any[], userId: string) => {
  if (!userId) return 0
  return goals.filter((g: any) => g.userId === userId && g.done).length
}

// Get current leading status
export const getLeaderStatus = (goals: any[], userId1: string, userId2: string) => {
  const user1Total = getTotalCompletedGoals(goals, userId1)
  const user2Total = getTotalCompletedGoals(goals, userId2)
  
  if (user1Total > user2Total) return { leader: 'you', diff: user1Total - user2Total }
  if (user2Total > user1Total) return { leader: 'friend', diff: user2Total - user1Total }
  return { leader: 'tied', diff: 0 }
}

export const getTodayGoalsForUser = (goals: any[], userId: string) => {
  if (!userId) return []
  const today = new Date().toISOString().split('T')[0]
  return goals.filter(
    (g: any) =>
      g.userId === userId && new Date(g.createdAt).toISOString().split('T')[0] === today
  )
}

// Get all goals for a user (not just today)
export const getAllGoalsForUser = (goals: any[], userId: string) => {
  if (!userId) return []
  return goals.filter((g: any) => g.userId === userId)
}

// ─── Materials ───
export const addMaterialToRoom = async (roomCode: string, userId: string, material: Omit<Material, 'id' | 'sharedAt' | 'markedHelpfulBy'>) => {
  const materialsRef = ref(database, `rooms/${roomCode}/materials`)
  const newMaterialRef = push(materialsRef)
  return set(newMaterialRef, {
    ...material,
    sharedBy: userId,
    sharedAt: Date.now(),
    markedHelpfulBy: [],
  })
}

export const listenToRoomMaterials = (roomCode: string, callback: (materials: Material[]) => void) => {
  const materialsRef = ref(database, `rooms/${roomCode}/materials`)
  const unsubscribe = onValue(
    materialsRef,
    (snapshot) => {
      try {
        const data = snapshot.val() || {}
        const materialsArray = Object.entries(data).map(([id, material]: [string, any]) => ({
          id,
          ...material,
        })) as Material[]
        callback(materialsArray)
      } catch (error) {
        console.error('Error processing materials:', error)
        callback([])
      }
    },
    (error) => {
      console.error('Error listening to materials:', error)
      callback([])
    }
  )
  return unsubscribe
}

export const deleteMaterial = async (roomCode: string, materialId: string) => {
  const materialRef = ref(database, `rooms/${roomCode}/materials/${materialId}`)
  return remove(materialRef)
}

export const toggleMaterialHelpful = async (roomCode: string, materialId: string, userId: string) => {
  const materialRef = ref(database, `rooms/${roomCode}/materials/${materialId}`)
  
  // Get current state
  const snapshot = await new Promise<any>((resolve) => {
    onValue(materialRef, (snap) => {
      resolve(snap.val())
    }, { onlyOnce: true })
  })

  if (!snapshot) return

  const markedHelpfulBy = snapshot.markedHelpfulBy || []
  const isMarkedByUser = markedHelpfulBy.includes(userId)
  const updatedMarkedHelpfulBy = isMarkedByUser
    ? markedHelpfulBy.filter((id: string) => id !== userId)
    : [...markedHelpfulBy, userId]

  return update(materialRef, {
    markedHelpfulBy: updatedMarkedHelpfulBy,
  })
}

export const searchMaterials = (materials: Material[], query: string): Material[] => {
  if (!query.trim()) return materials
  const lowerQuery = query.toLowerCase()
  return materials.filter(
    (m) =>
      m.title.toLowerCase().includes(lowerQuery) ||
      m.content.toLowerCase().includes(lowerQuery)
  )
}

export const getMaterialsByCategory = (materials: Material[], category: MaterialCategory): Material[] => {
  return materials.filter((m) => m.category === category)
}

// ─── Cleanup ───
// Remove user from room on logout
export const removeUserFromRoom = async (roomCode: string, userId: string) => {
  try {
    const userRef = ref(database, `rooms/${roomCode}/users/${userId}`)
    await remove(userRef)
    console.log(`User ${userId} removed from room ${roomCode}`)
  } catch (error) {
    console.error('Error removing user from room:', error)
  }
}
