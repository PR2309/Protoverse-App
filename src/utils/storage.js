// LocalStorage keys
export const STORAGE_KEYS = {
    MOOD_HISTORY: 'moodHistory',
    CHECK_IN_STREAK: 'checkInStreak',
    LAST_CHECK_IN: 'lastCheckIn',
    USER_NAME: 'userName',
    THEME: 'theme',
}

export const getMoodHistory = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.MOOD_HISTORY) || '[]')

export const getWeeklyCheckIns = () => {
    const history = getMoodHistory()
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    return history.filter(entry => entry.timestamp > oneWeekAgo)
}

export const updateStreak = () => {
    const history = getMoodHistory()
    if (history.length === 0) {
        localStorage.setItem(STORAGE_KEYS.CHECK_IN_STREAK, '0')
        return
    }
    let streak = 1
    const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp)
    for (let i = 0; i < sorted.length - 1; i++) {
        const curr = new Date(sorted[i].date).toDateString()
        const prev = new Date(sorted[i + 1].date).toDateString()
        if (curr !== prev) {
            const dayDiff = Math.floor((new Date(curr) - new Date(prev)) / (1000 * 60 * 60 * 24))
            if (dayDiff === 1) streak++
            else break
        }
    }
    localStorage.setItem(STORAGE_KEYS.CHECK_IN_STREAK, streak.toString())
}

export const getStreak = () => parseInt(localStorage.getItem(STORAGE_KEYS.CHECK_IN_STREAK) || '0')

export const getAverageStress = () => {
    const data = getWeeklyCheckIns()
    if (data.length === 0) return 0
    return (data.reduce((acc, e) => acc + e.stress, 0) / data.length).toFixed(1)
}

export const saveMoodCheckIn = (mood, stress) => {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.MOOD_HISTORY) || '[]')
    const checkIn = {
        id: Date.now(),
        date: new Date().toISOString(),
        mood: mood.value,
        moodLabel: mood.label,
        stress,
        timestamp: Date.now()
    }
    history.push(checkIn)
    localStorage.setItem(STORAGE_KEYS.MOOD_HISTORY, JSON.stringify(history))
    localStorage.setItem(STORAGE_KEYS.LAST_CHECK_IN, new Date().toISOString())
    updateStreak()
}
