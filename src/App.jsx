import { useState, useEffect } from 'react'
import './App.css'
import { AboutPage, ServicesPage, PrivacyPage, ContactPage, TermsPage, DisclaimerPage } from './InfoPages'

// Mood options with emojis
const MOODS = [
  { emoji: '😊', label: 'Great', value: 5, color: '#FFD93D' },
  { emoji: '🙂', label: 'Good', value: 4, color: '#6FCF97' },
  { emoji: '😐', label: 'Okay', value: 3, color: '#5DADE2' },
  { emoji: '😞', label: 'Not Good', value: 2, color: '#A0AEC0' },
  { emoji: '😢', label: 'Terrible', value: 1, color: '#9B8FBF' },
]

// LocalStorage helper functions
const STORAGE_KEYS = {
  MOOD_HISTORY: 'moodHistory',
  CHECK_IN_STREAK: 'checkInStreak',
  LAST_CHECK_IN: 'lastCheckIn',
  USER_NAME: 'userName',
  THEME: 'theme',
}

const saveMoodCheckIn = (mood, stress) => {
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

  // Update streak
  updateStreak()
}

const getMoodHistory = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.MOOD_HISTORY) || '[]')
}

const getWeeklyCheckIns = () => {
  const history = getMoodHistory()
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
  return history.filter(entry => entry.timestamp > oneWeekAgo)
}

const updateStreak = () => {
  const history = getMoodHistory()
  if (history.length === 0) {
    localStorage.setItem(STORAGE_KEYS.CHECK_IN_STREAK, '0')
    return
  }

  let streak = 1
  const today = new Date().toDateString()
  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp)

  for (let i = 0; i < sortedHistory.length - 1; i++) {
    const currentDate = new Date(sortedHistory[i].date).toDateString()
    const previousDate = new Date(sortedHistory[i + 1].date).toDateString()

    if (currentDate !== previousDate) {
      const dayDiff = Math.floor((new Date(currentDate) - new Date(previousDate)) / (1000 * 60 * 60 * 24))
      if (dayDiff === 1) {
        streak++
      } else {
        break
      }
    }
  }

  localStorage.setItem(STORAGE_KEYS.CHECK_IN_STREAK, streak.toString())
}

const getStreak = () => {
  return parseInt(localStorage.getItem(STORAGE_KEYS.CHECK_IN_STREAK) || '0')
}

const getAverageStress = () => {
  const weeklyData = getWeeklyCheckIns()
  if (weeklyData.length === 0) return 0
  const sum = weeklyData.reduce((acc, entry) => acc + entry.stress, 0)
  return (sum / weeklyData.length).toFixed(1)
}

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [selectedMood, setSelectedMood] = useState(null)
  const [stressLevel, setStressLevel] = useState(null)
  const [checkInComplete, setCheckInComplete] = useState(false)
  const [weeklyCheckIns, setWeeklyCheckIns] = useState(0)
  const [streak, setStreak] = useState(0)
  const [avgStress, setAvgStress] = useState(0)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [theme, setTheme] = useState('light')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Load data and theme on mount
  useEffect(() => {
    const weekly = getWeeklyCheckIns()
    setWeeklyCheckIns(weekly.length)
    setStreak(getStreak())
    setAvgStress(getAverageStress())

    // Load theme
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)

    // Check if already checked in today
    const lastCheckIn = localStorage.getItem(STORAGE_KEYS.LAST_CHECK_IN)
    if (lastCheckIn) {
      const lastDate = new Date(lastCheckIn).toDateString()
      const today = new Date().toDateString()
      if (lastDate === today) {
        setCheckInComplete(true)
      }
    }

    // PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const navigateTo = (view) => {
    setCurrentView(view)
    closeSidebar()
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setShowInstallPrompt(false)
    }

    setDeferredPrompt(null)
  }

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
  }

  const handleStressSelect = (level) => {
    setStressLevel(level)
  }

  const handleCheckInSubmit = () => {
    if (selectedMood && stressLevel) {
      saveMoodCheckIn(selectedMood, stressLevel)
      setCheckInComplete(true)

      // Update stats
      const weekly = getWeeklyCheckIns()
      setWeeklyCheckIns(weekly.length)
      setStreak(getStreak())
      setAvgStress(getAverageStress())

      // Reset form after 3 seconds
      setTimeout(() => {
        setSelectedMood(null)
        setStressLevel(null)
      }, 3000)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning ☀️'
    if (hour < 17) return 'Good Afternoon 🌤️'
    return 'Good Evening 🌙'
  }

  const renderHome = () => (
    <div className="fade-in">
      {/* PWA Install Banner */}
      {showInstallPrompt && (
        <div className="notification mb-l">
          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Install App</strong>
              <p style={{ marginBottom: 0, fontSize: '14px', marginTop: '4px' }}>
                Install this app for quick access and offline support
              </p>
            </div>
            <div className="flex gap-s">
              <button className="btn btn-primary" onClick={handleInstallClick}>
                Install
              </button>
              <button className="btn btn-secondary" onClick={() => setShowInstallPrompt(false)}>
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Greeting */}
      <div className="text-center mb-xl">
        <h1>{getGreeting()}</h1>
        <p className="text-muted">Welcome back to your safe space</p>
        {streak > 0 && (
          <div className="streak-badge">
            🔥 {streak} day streak!
          </div>
        )}
      </div>

      {/* Daily Check-In Card */}
      <div className="card-elevated mb-l">
        <h2 className="mb-m">📝 Daily Check-In</h2>

        {!checkInComplete ? (
          <>
            <p className="text-muted mb-l">How are you feeling today?</p>

            {/* Mood Selector */}
            <div className="mood-selector mb-l">
              {MOODS.map((mood) => (
                <div
                  key={mood.value}
                  className={`mood-option ${selectedMood?.value === mood.value ? 'selected' : ''}`}
                  onClick={() => handleMoodSelect(mood)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${mood.label} mood`}
                  title={mood.label}
                >
                  {mood.emoji}
                </div>
              ))}
            </div>

            {selectedMood && (
              <div className="fade-in">
                <p className="text-muted mb-m">How stressed are you today?</p>
                <div className="stress-selector mb-l">
                  <div className="stress-labels">
                    <span className="text-muted" style={{ fontSize: '12px' }}>Not Stressed</span>
                    <span className="text-muted" style={{ fontSize: '12px' }}>Extremely Stressed</span>
                  </div>
                  <div className="stress-options">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        className={`stress-btn ${stressLevel === level ? 'selected' : ''}`}
                        onClick={() => handleStressSelect(level)}
                        aria-label={`Stress level ${level}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {stressLevel && (
                  <button className="btn btn-primary" onClick={handleCheckInSubmit}>
                    Complete Check-In
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center fade-in">
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3>Check-In Complete!</h3>
            <p className="text-muted">Thank you for sharing how you're feeling</p>
            <p className="text-muted" style={{ fontSize: '14px' }}>
              Come back tomorrow to continue your journey
            </p>
          </div>
        )}
      </div>

      {/* Emergency Support Button */}
      <div className="text-center mb-l">
        <button
          className="btn btn-emergency"
          onClick={() => navigateTo('emergency')}
        >
          🚨 Need Help Now?
        </button>
      </div>

      {/* Progress Section */}
      <div className="card mb-l">
        <h3 className="mb-m">Your Progress This Week 📊</h3>
        <div className="mb-m">
          <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="text-muted">Check-ins completed</span>
            <span style={{ fontWeight: 600 }}>{weeklyCheckIns}/7</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(weeklyCheckIns / 7) * 100}%` }}></div>
          </div>
        </div>
        {avgStress > 0 && (
          <p className="text-muted" style={{ fontSize: '14px', marginBottom: 0 }}>
            Average stress level: {avgStress}/5
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="mb-m">Quick Actions</h3>
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => navigateTo('chat')}>
            <span className="quick-action-icon">💬</span>
            <span className="quick-action-label">Chat</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigateTo('breathe')}>
            <span className="quick-action-icon">🧘</span>
            <span className="quick-action-label">Calm</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigateTo('community')}>
            <span className="quick-action-icon">👥</span>
            <span className="quick-action-label">Talk</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderEmergency = () => (
    <div className="emergency-screen fade-in">
      <div className="card-elevated">
        <div className="text-center mb-l">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚨</div>
          <h1>You Don't Have to Face This Alone</h1>
          <p className="text-muted">
            We're concerned about you. Please reach out to someone who can help:
          </p>
        </div>

        <div className="divider mb-l"></div>

        <h3 className="mb-m">📞 Crisis Helplines (24/7)</h3>

        <a href="tel:912227546669" className="helpline-card mb-m" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="helpline-info">
            <strong>AASRA</strong>
            <p className="text-muted" style={{ marginBottom: 0 }}>91-22-27546669</p>
          </div>
          <button className="btn btn-primary">Call Now</button>
        </a>

        <a href="tel:18602662345" className="helpline-card mb-m" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="helpline-info">
            <strong>Vandrevala Foundation</strong>
            <p className="text-muted" style={{ marginBottom: 0 }}>1860-2662-345</p>
          </div>
          <button className="btn btn-primary">Call Now</button>
        </a>

        <a href="tel:912225521111" className="helpline-card mb-l" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="helpline-info">
            <strong>iCall</strong>
            <p className="text-muted" style={{ marginBottom: 0 }}>91-22-25521111</p>
          </div>
          <button className="btn btn-primary">Call Now</button>
        </a>

        <div className="divider mb-l"></div>

        <h3 className="mb-m">👤 Your Trusted Contact</h3>
        <div className="helpline-card mb-l">
          <div className="helpline-info">
            <strong>Emergency Contact</strong>
            <p className="text-muted" style={{ marginBottom: 0 }}>Configure in settings</p>
          </div>
          <div className="flex gap-s">
            <button className="btn btn-secondary">Call</button>
            <button className="btn btn-secondary">Message</button>
          </div>
        </div>

        <div className="divider mb-l"></div>

        <button className="btn btn-secondary" style={{ width: '100%', marginBottom: '16px' }}>
          📋 View My Safety Plan
        </button>

        <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setCurrentView('home')}>
          I'm Safe Now
        </button>
      </div>
    </div>
  )

  const renderBreathing = () => {
    const [breathingActive, setBreathingActive] = useState(false)
    const [breathingPhase, setBreathingPhase] = useState('Inhale')

    useEffect(() => {
      if (!breathingActive) return

      const phases = ['Inhale', 'Hold', 'Exhale', 'Hold']
      let currentPhaseIndex = 0

      const interval = setInterval(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length
        setBreathingPhase(phases[currentPhaseIndex])
      }, 4000)

      return () => clearInterval(interval)
    }, [breathingActive])

    return (
      <div className="breathing-screen fade-in">
        <div className="card-elevated text-center">
          <h1 className="mb-m">🧘 Box Breathing</h1>
          <p className="text-muted mb-l">Follow the circle to calm your mind</p>

          <div className="breathing-circle mb-l">
            <div className={`breathing-circle-inner ${breathingActive ? 'active' : ''}`}>
              <span>{breathingActive ? breathingPhase : 'Breathe'}</span>
            </div>
          </div>

          <div className="breathing-instructions mb-l">
            <p><strong>Inhale</strong> for 4 seconds</p>
            <p><strong>Hold</strong> for 4 seconds</p>
            <p><strong>Exhale</strong> for 4 seconds</p>
            <p><strong>Hold</strong> for 4 seconds</p>
          </div>

          <button
            className="btn btn-primary mb-m"
            onClick={() => setBreathingActive(!breathingActive)}
          >
            {breathingActive ? 'Stop Exercise' : 'Start Exercise'}
          </button>
          <button className="btn btn-secondary" onClick={() => navigateTo('home')}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const renderChat = () => (
    <div className="chat-screen fade-in">
      <div className="card-elevated">
        <h1 className="mb-m">💬 AI Support Chat</h1>
        <div className="notification mb-l">
          <p style={{ marginBottom: 0, fontSize: '14px' }}>
            <strong>Reminder:</strong> I'm here to listen and support, but I'm not a therapist.
            For professional help, please reach out to a licensed mental health professional.
          </p>
        </div>

        <div className="chat-messages mb-m">
          <div className="chat-message ai-message">
            <p>Hello! I'm here to listen without judgment. How are you feeling today?</p>
          </div>
        </div>

        <div className="chat-input-container">
          <textarea
            placeholder="Type your message here..."
            rows="3"
            style={{ marginBottom: '12px' }}
          ></textarea>
          <button className="btn btn-primary" style={{ width: '100%' }}>Send</button>
        </div>

        <button className="btn btn-secondary mt-m" onClick={() => navigateTo('home')}>
          Back to Home
        </button>
      </div>
    </div>
  )

  const renderCommunity = () => (
    <div className="community-screen fade-in">
      <div className="card-elevated">
        <h1 className="mb-m">👥 Peer Support Community</h1>
        <p className="text-muted mb-l">Connect with others facing similar challenges</p>

        <div className="topic-rooms mb-l">
          <button className="topic-room-btn">
            <span>💼 Early-Career Stress</span>
          </button>
          <button className="topic-room-btn">
            <span>🏠 Family Expectations</span>
          </button>
          <button className="topic-room-btn">
            <span>😰 Burnout & Exhaustion</span>
          </button>
          <button className="topic-room-btn">
            <span>🌱 Hope & Progress</span>
          </button>
        </div>

        <button className="btn btn-secondary" onClick={() => setCurrentView('home')}>
          Back to Home
        </button>
      </div>
    </div>
  )

  return (
    <div className="app">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={closeSidebar} aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <button className="sidebar-link" onClick={() => navigateTo('home')}>
            <span className="sidebar-icon">🏠</span>
            <span>Home</span>
          </button>
          <button className="sidebar-link" onClick={() => navigateTo('chat')}>
            <span className="sidebar-icon">💬</span>
            <span>AI Support Chat</span>
          </button>
          <button className="sidebar-link" onClick={() => navigateTo('breathe')}>
            <span className="sidebar-icon">🧘</span>
            <span>Breathing Exercises</span>
          </button>
          <button className="sidebar-link" onClick={() => navigateTo('community')}>
            <span className="sidebar-icon">👥</span>
            <span>Community</span>
          </button>
          <button className="sidebar-link" onClick={() => navigateTo('emergency')}>
            <span className="sidebar-icon">🚨</span>
            <span>Emergency Support</span>
          </button>

          <div className="sidebar-divider"></div>

          <button className="sidebar-link" onClick={() => navigateTo('about')}>
            <span className="sidebar-icon">ℹ️</span>
            <span>About</span>
          </button>
          <button className="sidebar-link" onClick={() => navigateTo('services')}>
            <span className="sidebar-icon">🛠️</span>
            <span>Our Services</span>
          </button>
          <button className="sidebar-link" onClick={() => navigateTo('privacy')}>
            <span className="sidebar-icon">🔒</span>
            <span>Privacy Policy</span>
          </button>
          <button className="sidebar-link" onClick={() => navigateTo('contact')}>
            <span className="sidebar-icon">📧</span>
            <span>Contact Us</span>
          </button>

          <div className="sidebar-divider"></div>

          <button className="sidebar-link theme-toggle" onClick={toggleTheme}>
            <span className="sidebar-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </nav>
      </aside>

      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="icon-btn" onClick={toggleSidebar} aria-label="Menu">
              ☰
            </button>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Early Distress Support</h3>
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="container" style={{ maxWidth: '600px', paddingBottom: '200px' }}>
          {currentView === 'home' && renderHome()}
          {currentView === 'emergency' && renderEmergency()}
          {currentView === 'breathe' && renderBreathing()}
          {currentView === 'chat' && renderChat()}
          {currentView === 'community' && renderCommunity()}
          {currentView === 'about' && <AboutPage />}
          {currentView === 'services' && <ServicesPage />}
          {currentView === 'privacy' && <PrivacyPage />}
          {currentView === 'contact' && <ContactPage />}
          {currentView === 'terms' && <TermsPage />}
          {currentView === 'disclaimer' && <DisclaimerPage />}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Early Distress Support</h4>
              <p>Supporting mental well-being for early-career individuals</p>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <button className="footer-link" onClick={() => navigateTo('about')}>About Us</button>
              <button className="footer-link" onClick={() => navigateTo('services')}>Our Services</button>
              <button className="footer-link" onClick={() => navigateTo('emergency')}>Crisis Support</button>
            </div>

            <div className="footer-section">
              <h4>Legal</h4>
              <button className="footer-link" onClick={() => navigateTo('privacy')}>Privacy Policy</button>
              <button className="footer-link" onClick={() => navigateTo('terms')}>Terms of Service</button>
              <button className="footer-link" onClick={() => navigateTo('disclaimer')}>Disclaimer</button>
            </div>

            <div className="footer-section">
              <h4>Contact</h4>
              <button className="footer-link" onClick={() => navigateTo('contact')}>Contact Us</button>
              <p className="footer-text">Email: support@distresssupport.app</p>
              <p className="footer-text">Available 24/7 for crisis support</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Early Distress Support App. All rights reserved.</p>
            <p className="footer-disclaimer">
              This app supports mental well-being but does not replace professional mental health care.
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="bottom-nav-items">
          <button
            className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => navigateTo('home')}
          >
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </button>
          <button
            className={`nav-item ${currentView === 'breathe' ? 'active' : ''}`}
            onClick={() => navigateTo('breathe')}
          >
            <span className="nav-icon">🧰</span>
            <span>Tools</span>
          </button>
          <button
            className={`nav-item ${currentView === 'progress' ? 'active' : ''}`}
            onClick={() => alert('Progress view coming soon!')}
          >
            <span className="nav-icon">📈</span>
            <span>Progress</span>
          </button>
          <button
            className="nav-item"
            onClick={toggleSidebar}
          >
            <span className="nav-icon">⋯</span>
            <span>More</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default App
