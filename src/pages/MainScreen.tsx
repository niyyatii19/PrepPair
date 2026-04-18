import { useState, useEffect } from 'react'
import {
  registerUserInRoom,
  getUsersInRoom,
  addGoalToRoom,
  listenToRoomGoals,
  toggleGoalDone,
  deleteGoal,
  calculateStreak,
  getWeekStatsForUser,
  getTodayGoalsForUser,
  getTotalCompletedGoals,
  getLeaderStatus,
  removeUserFromRoom,
} from '../lib/firebaseRoom'

interface MainScreenProps {
  userData: any
  onLogout: () => void
  isOnline: boolean
}

interface Goal {
  id: string
  text: string
  done: boolean
  category: string
  userId: string
  createdAt: number
  completedAt?: number
}

export default function MainScreen({ userData, onLogout }: MainScreenProps) {
  const [activeTab, setActiveTab] = useState('goals')
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoalText, setNewGoalText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('dsa')
  const [showToast, setShowToast] = useState(false)
  const [toastText, setToastText] = useState('')
  const [allUsers, setAllUsers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  const categories = ['dsa', 'system', 'mock', 'revision', 'other']
  const categoryLabels = {
    dsa: 'DSA',
    system: 'System',
    mock: 'Mock',
    revision: 'Revision',
    other: 'Other',
  }

  const roomCode = userData.room
  const userId = userData.id
  const friendRole = userData.role === 'you' ? 'friend' : 'you'
  const friendData = Object.values(allUsers).find((u: any) => u?.role === friendRole) as any
  
  // Debug: Log if friend is found
  useEffect(() => {
    if (!friendData && allUsers && Object.keys(allUsers).length > 0) {
      console.warn('Friend not found. allUsers:', Object.keys(allUsers), 'Looking for role:', friendRole)
    }
  }, [friendData, allUsers, friendRole])

  // Initialize Firebase listeners
  useEffect(() => {
    if (!roomCode || !userId) return

    console.log(`Initializing listeners for user ${userId} in room ${roomCode}`)

    // Register user in room
    registerUserInRoom(roomCode, userId, {
      name: userData.name,
      role: userData.role,
    }).catch(console.error)

    // Listen to all users in room
    const unsubscribeUsers = getUsersInRoom(roomCode, (users) => {
      console.log('Users updated:', Object.keys(users))
      setAllUsers(users)
    })

    // Listen to goals
    const unsubscribeGoals = listenToRoomGoals(roomCode, (goalsData) => {
      console.log(`Goals updated: ${goalsData.length} total`)
      setGoals(goalsData)
      setLoading(false)
    })

    return () => {
      console.log(`Cleaning up listeners for user ${userId}`)
      unsubscribeUsers()
      unsubscribeGoals()
      // Reset state on unmount
      setGoals([])
      setAllUsers({})
      setLoading(true)
    }
  }, [roomCode, userId])

  const showToastMessage = (text: string) => {
    setToastText(text)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleClearAllData = async () => {
    if (!window.confirm('Delete ALL your goals? This cannot be undone!')) return
    
    try {
      console.log('Clearing all user goals...')
      // Delete from state immediately
      setGoals([])
      showToastMessage('All your goals cleared')
    } catch (error) {
      console.error('Error clearing goals:', error)
      showToastMessage('Error clearing goals')
    }
  }

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoalText.trim()) return

    try {
      await addGoalToRoom(roomCode, userId, {
        text: newGoalText.trim(),
        done: false,
        category: selectedCategory,
      })
      setNewGoalText('')
      showToastMessage('Goal added!')
    } catch (error) {
      console.error('Error adding goal:', error)
      showToastMessage('Failed to add goal')
    }
  }

  const handleToggleGoal = async (goalId: string, currentDone: boolean) => {
    try {
      await toggleGoalDone(roomCode, goalId, !currentDone)
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(roomCode, goalId)
      showToastMessage('Goal removed')
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const handleCopyRoom = () => {
    navigator.clipboard.writeText(roomCode)
    showToastMessage('Room code copied!')
  }

  const getGoalCategoryClass = (category: string) => {
    return `tag-${category}`
  }

  const todayGoals = getTodayGoalsForUser(goals, userId)
  const friendGoals = friendData ? getTodayGoalsForUser(goals, friendData.id) : []
  const completedCount = todayGoals.filter((g) => g.done).length
  const completionPercentage = todayGoals.length > 0 ? Math.round((completedCount / todayGoals.length) * 100) : 0
  const strokeDashoffset = 220 * (1 - completionPercentage / 100)

  // Friend stats
  const friendCompletedCount = friendGoals.filter((g) => g.done).length
  const friendCompletionPercentage = friendGoals.length > 0 ? Math.round((friendCompletedCount / friendGoals.length) * 100) : 0
  const friendStrokeDashoffset = 220 * (1 - friendCompletionPercentage / 100)

  const userStreak = calculateStreak(goals, userId)
  const friendStreak = friendData ? calculateStreak(goals, friendData.id) : 0

  const weekStats = getWeekStatsForUser(goals, userId)
  const friendWeekStats = friendData ? getWeekStatsForUser(goals, friendData.id) : {}
  
  // Calculate who's leading
  const userTotalCompleted = getTotalCompletedGoals(goals, userId)
  const friendTotalCompleted = friendData ? getTotalCompletedGoals(goals, friendData.id) : 0
  const leaderStatus = getLeaderStatus(goals, userId, friendData?.id || '')

  if (loading) {
    return (
      <div className="screen-app">
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-logo">PP</div>
            <div>
              <div className="topbar-title">Connecting...</div>
              <div className="topbar-date">Loading</div>
            </div>
          </div>
        </div>
        <div className="content" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '2rem' }}>⏳</div>
          <div style={{ marginTop: '1rem', color: 'var(--muted)' }}>Connecting to Firebase...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="screen-app">
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="topbar-logo">PP</div>
          <div>
            <div className="topbar-title">Room: {roomCode}</div>
            <div className="topbar-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="topbar-right">
          <div className={`avatar ${userData.role}`}>{userData.name.charAt(0).toUpperCase()}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
            {friendData ? '🟢 Friend online' : '⚪ Waiting for friend...'}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="tab-bar">
        <div className={`tab ${activeTab === 'goals' ? 'active' : ''}`} onClick={() => setActiveTab('goals')}>
          Goals <span className="tab-badge">{completedCount}/{todayGoals.length}</span>
        </div>
        <div className={`tab ${activeTab === 'friend' ? 'active' : ''}`} onClick={() => setActiveTab('friend')}>
          {friendData ? friendData.name : 'Friend'}
        </div>
        <div className={`tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
          Stats
        </div>
        <div className={`tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          Settings
        </div>
      </div>

      {/* Content */}
      <div className="content">
        {/* Goals Tab */}
        <div className={`tab-panel ${activeTab === 'goals' ? 'active' : ''}`}>
          <div className="progress-cards">
            <div className="progress-card you-card">
              <div className="ring-wrap">
                <svg className="ring-svg" width="80" height="80" viewBox="0 0 80 80">
                  <circle className="ring-track" cx="40" cy="40" r="35" />
                  <circle
                    className="ring-progress you"
                    cx="40"
                    cy="40"
                    r="35"
                    style={{ strokeDashoffset }}
                  />
                </svg>
                <div className="ring-label">{completionPercentage}%</div>
              </div>
              <div className="pc-name">{userData.name}</div>
              <div className="pc-stats">
                {completedCount}/{todayGoals.length} today
              </div>
              <div className="pc-streak you">🔥 {userStreak} days</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '4px' }}>
                {leaderStatus.leader === 'you' ? '👑 Leading' : leaderStatus.leader === 'friend' ? '🎯 Behind' : '⚖️ Tied'} ({userTotalCompleted} total)
              </div>
            </div>

            <div className="progress-card friend-card">
              <div className="ring-wrap">
                <svg className="ring-svg" width="80" height="80" viewBox="0 0 80 80">
                  <circle className="ring-track" cx="40" cy="40" r="35" />
                  <circle
                    className="ring-progress friend"
                    cx="40"
                    cy="40"
                    r="35"
                    style={{ strokeDashoffset: friendStrokeDashoffset }}
                  />
                </svg>
                <div className="ring-label">{friendCompletionPercentage}%</div>
              </div>
              <div className="pc-name">{friendData?.name || 'Friend'}</div>
              <div className="pc-stats">
                {friendCompletedCount}/{friendGoals.length} today
              </div>
              <div className="pc-streak friend">🔥 {friendStreak} days</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--friend)', marginTop: '4px' }}>
                {leaderStatus.leader === 'friend' ? '👑 Leading' : leaderStatus.leader === 'you' ? '🎯 Behind' : '⚖️ Tied'} ({friendTotalCompleted} total)
              </div>
            </div>
          </div>

          <form onSubmit={handleAddGoal}>
            <div className="section-head">
              <span className="section-title">Add Goal</span>
            </div>
            <div className="add-goal-bar">
              <input
                type="text"
                className="add-goal-input"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="What's your next objective?"
              />
              <button type="submit" className="btn-add">
                +
              </button>
            </div>
          </form>

          <div>
            <div className="section-head">
              <span className="section-title">Category</span>
            </div>
            <div className="cat-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {categoryLabels[cat as keyof typeof categoryLabels]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="section-head">
              <span className="section-title">Today's Goals</span>
            </div>
            {todayGoals.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <p>No goals yet. Add one to get started!</p>
              </div>
            ) : (
              <div className="goals-list">
                {todayGoals.map((goal) => (
                  <div key={goal.id} className={`goal-item ${goal.done ? 'done' : ''}`}>
                    <button
                      className="goal-check"
                      onClick={() => handleToggleGoal(goal.id, goal.done)}
                    >
                      ✓
                    </button>
                    <span className="goal-text">{goal.text}</span>
                    <span className={`goal-cat-tag ${getGoalCategoryClass(goal.category)}`}>
                      {categoryLabels[goal.category as keyof typeof categoryLabels]}
                    </span>
                    <button className="goal-delete" onClick={() => handleDeleteGoal(goal.id)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Friend Tab */}
        <div className={`tab-panel ${activeTab === 'friend' ? 'active' : ''}`}>
          {friendData ? (
            <>
              <div className="friend-header-card">
                <div className="friend-avatar-lg">{friendData.name.charAt(0).toUpperCase()}</div>
                <div className="friend-info">
                  <h3>{friendData.name}</h3>
                  <p>Player 2 in Room {roomCode}</p>
                  <div className="friend-progress-bar-wrap">
                    <div className="friend-progress-label">
                      <span>Progress</span>
                      <span>{friendCompletionPercentage}%</span>
                    </div>
                    <div className="friend-progress-bar">
                      <div className="friend-progress-fill" style={{ width: `${friendCompletionPercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="section-head">
                  <span className="section-title">Friend's Goals</span>
                </div>
                {friendGoals.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <p>Friend hasn't added any goals yet</p>
                  </div>
                ) : (
                  <div className="goals-list">
                    {friendGoals.map((goal) => (
                      <div key={goal.id} className={`friend-goal-item ${goal.done ? 'done' : ''}`}>
                        <div className="friend-goal-check">✓</div>
                        <span className="friend-goal-text">{goal.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p>Waiting for your friend to join the room...</p>
              <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--muted2)' }}>
                Share room code: <strong>{roomCode}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Stats Tab */}
        <div className={`tab-panel ${activeTab === 'stats' ? 'active' : ''}`}>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Goals</div>
              <div className="stat-value accent">{todayGoals.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Completed</div>
              <div className="stat-value accent">{completedCount}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Streak</div>
              <div className="stat-value accent">{userStreak}</div>
              <div className="stat-sub">days in a row</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Best Day</div>
              <div className="stat-value accent">
                {Math.max(...Object.values(weekStats).map((s: any) => s.completed), 0)}
              </div>
              <div className="stat-sub">goals in a day</div>
            </div>
          </div>

          {/* Leader Comparison */}
          {friendData && (
            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(200,241,53,0.05)', borderRadius: '8px', border: '1px solid rgba(200,241,53,0.2)' }}>
              <div className="section-title" style={{ marginBottom: '12px', fontSize: '0.9rem' }}>🏆 Head to Head</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(200,241,53,0.1)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted2)' }}>You</div>
                  <div style={{ fontSize: '1.4rem', color: 'var(--accent)', fontWeight: 'bold', margin: '4px 0' }}>{userTotalCompleted}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted2)' }}>goals completed</div>
                </div>
                <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(100,150,255,0.1)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted2)' }}>{friendData.name}</div>
                  <div style={{ fontSize: '1.4rem', color: 'var(--friend)', fontWeight: 'bold', margin: '4px 0' }}>{friendTotalCompleted}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted2)' }}>goals completed</div>
                </div>
              </div>
              {leaderStatus.leader !== 'tied' && (
                <div style={{ marginTop: '8px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--accent)' }}>
                  {leaderStatus.leader === 'you' ? `🎉 You're ahead by ${leaderStatus.diff}` : `Your friend is ahead by ${leaderStatus.diff}`}
                </div>
              )}
            </div>
          )}

          <div className="week-chart">
            <div className="section-title" style={{ marginBottom: '12px' }}>
              This Week
            </div>
            <div className="week-bars">
              {Object.entries(weekStats).map(([date, stats]: [string, any]) => {
                const friendStats = friendWeekStats[date] || { completed: 0 }
                const maxGoals = 5
                return (
                  <div key={date} className="week-bar-wrap">
                    <div className="week-bar-pair">
                      <div className="week-bar you" style={{ height: `${Math.min((stats.completed / maxGoals) * 100, 100)}%` }}></div>
                      <div className="week-bar friend" style={{ height: `${Math.min((friendStats.completed / maxGoals) * 100, 100)}%` }}></div>
                    </div>
                    <div className="week-day">{stats.day}</div>
                  </div>
                )
              })}
            </div>
            <div className="week-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: 'var(--accent)' }}></div>
                You
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: 'var(--friend)' }}></div>
                Friend
              </div>
            </div>
          </div>
        </div>

        {/* Settings Tab */}
        <div className={`tab-panel ${activeTab === 'settings' ? 'active' : ''}`}>
          <div className="room-code-box">
            <div className="section-title">Room Code</div>
            <div className="room-code-display">{roomCode}</div>
            <button className="btn-copy" onClick={handleCopyRoom}>
              📋 Copy Room Code
            </button>
          </div>

          <div className="settings-section">
            <div className="section-title">User Info</div>
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-label">{userData.name}</div>
                <div className="settings-row-sub">{userData.role === 'you' ? 'Player 1' : 'Player 2'}</div>
              </div>
            </div>
          </div>

          <button 
            className="btn-logout" 
            onClick={handleClearAllData}
            style={{ background: 'rgba(255,100,100,0.3)', borderColor: 'rgb(255,100,100)' }}
          >
            🗑️ Clear All My Goals
          </button>

          <button className="btn-logout" onClick={onLogout}>
            Logout & Switch Room
          </button>
        </div>
      </div>

      {/* Toast */}
      {showToast && <div className={`toast ${showToast ? 'show' : ''}`}>{toastText}</div>}
    </div>
  )
}
