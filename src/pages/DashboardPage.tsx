import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { ref, onValue, set, remove } from 'firebase/database'
import { auth, database } from '../lib/firebase'
import { logout } from '../lib/auth'
import { saveGoal, getGoalsForDate } from '../lib/indexeddb'
import { sendNotification, requestNotificationPermission } from '../lib/notifications'

interface Goal {
  id: string
  text: string
  done: boolean
  createdAt: number
  completedAt?: number
}

export default function DashboardPage() {
  const [user] = useAuthState(auth)
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [friendData, setFriendData] = useState<any>(null)
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  // Load today's goals from Firebase
  useEffect(() => {
    if (!user) return

    const goalsRef = ref(database, `goals/${user.uid}/${today}`)
    const unsubscribe = onValue(goalsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const goalsArray = Object.entries(data).map(([id, goal]: [string, any]) => ({
          id,
          ...goal,
        }))
        setGoals(goalsArray)
      } else {
        setGoals([])
      }
    })

    return () => unsubscribe()
  }, [user, today])

  // Load friend data if connected
  useEffect(() => {
    if (!user) return

    const userRef = ref(database, `users/${user.uid}`)
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val()
      if (data?.friendId) {
        const friendRef = ref(database, `users/${data.friendId}`)
        const friendUnsub = onValue(friendRef, (friendSnapshot) => {
          setFriendData(friendSnapshot.val())
        })
        return () => friendUnsub()
      }
    })

    return () => unsubscribe()
  }, [user])

  // Prompt for notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      setShowNotificationPrompt(true)
    }
  }, [])

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.trim() || !user) return

    setIsAdding(true)
    try {
      const goalId = `goal_${Date.now()}`
      const goalData = {
        id: goalId,
        text: newGoal,
        done: false,
        createdAt: Date.now(),
      }

      // Save to Firebase
      await set(ref(database, `goals/${user.uid}/${today}/${goalId}`), goalData)

      // Save to IndexedDB
      await saveGoal(goalData)

      setNewGoal('')
    } catch (error) {
      console.error('Error adding goal:', error)
      alert('Failed to add goal')
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleGoal = async (goal: Goal) => {
    if (!user) return

    try {
      const updatedGoal = {
        ...goal,
        done: !goal.done,
        completedAt: !goal.done ? Date.now() : undefined,
      }

      await set(ref(database, `goals/${user.uid}/${today}/${goal.id}`), updatedGoal)
      await saveGoal(updatedGoal)

      if (!goal.done) {
        sendNotification('🎉 Goal completed!', {
          body: goal.text,
        })
      }
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (!user) return

    try {
      await remove(ref(database, `goals/${user.uid}/${today}/${goalId}`))
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleNotificationPermission = async () => {
    const token = await requestNotificationPermission()
    if (token) {
      // Store token in Firebase if needed
      if (user) {
        await set(ref(database, `users/${user.uid}/fcmToken`), token)
      }
      setShowNotificationPrompt(false)
    }
  }

  const completedCount = goals.filter(g => g.done).length
  const completionPercentage = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0

  return (
    <div className="min-h-screen pb-24 pt-4 px-4">
      {/* Notification Prompt */}
      {showNotificationPrompt && (
        <div className="fixed top-4 left-4 right-4 bg-blue-500 text-white rounded-lg p-4 shadow-lg z-40">
          <p className="font-semibold mb-2">Enable notifications?</p>
          <div className="flex gap-2">
            <button
              onClick={handleNotificationPermission}
              className="bg-white text-blue-500 px-4 py-1 rounded font-semibold text-sm"
            >
              Yes
            </button>
            <button
              onClick={() => setShowNotificationPrompt(false)}
              className="bg-blue-400 px-4 py-1 rounded text-sm"
            >
              Later
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pair-Prep</h1>
          <p className="text-gray-500 text-sm">Today's Goals</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-smooth"
        >
          Logout
        </button>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Your Progress */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-800">Your Goals</h2>
                <span className="text-sm font-semibold text-blue-600">
                  {completedCount}/{goals.length}
                </span>
              </div>

              {/* Progress Ring */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 35}`}
                      strokeDashoffset={`${2 * Math.PI * 35 * (1 - completionPercentage / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-800">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">
                    {completionPercentage === 100 ? '🎉 All done!' : `${goals.length - completedCount} goals left`}
                  </p>
                </div>
              </div>
            </div>

            {/* Add Goal Form */}
            <form onSubmit={handleAddGoal} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Add a new goal..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={isAdding || !newGoal.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-smooth disabled:opacity-50"
                >
                  {isAdding ? '...' : 'Add'}
                </button>
              </div>
            </form>

            {/* Goals List */}
            <div className="space-y-2">
              {goals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No goals yet. Add one to get started! 🚀</p>
                </div>
              ) : (
                goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="goal-item flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-smooth"
                  >
                    <input
                      type="checkbox"
                      checked={goal.done}
                      onChange={() => handleToggleGoal(goal)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <span
                      className={`flex-1 ${
                        goal.done ? 'line-through text-gray-400' : 'text-gray-800'
                      }`}
                    >
                      {goal.text}
                    </span>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Friend's Progress */}
        <div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md p-6 h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Friend's Progress</h2>
            {friendData ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {friendData.avatarUrl ? (
                    <img
                      src={friendData.avatarUrl}
                      alt={friendData.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center text-white font-semibold">
                      {friendData.name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{friendData.name}</p>
                    <p className="text-xs text-gray-600">Study partner</p>
                  </div>
                </div>

                <div className="bg-white rounded p-3">
                  <p className="text-xs text-gray-600 mb-1">Status</p>
                  <p className="text-sm text-gray-800">Waiting for sync...</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-2">Not connected yet</p>
                <p className="text-xs text-gray-500 mb-4">Invite your study partner to get started</p>
                <input
                  type="text"
                  placeholder="Friend's ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
