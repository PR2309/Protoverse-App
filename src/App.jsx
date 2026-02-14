import { useState, useEffect, useCallback } from 'react';
import { AboutPage, ServicesPage, PrivacyPage, ContactPage, TermsPage, DisclaimerPage } from './InfoPages'
import { FiPhoneCall, FiMail } from "react-icons/fi";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
// Mood options
const MOODS = [
  { symbol: '😊', label: 'Great', value: 5 },
  { symbol: '🙂', label: 'Good', value: 4 },
  { symbol: '😐', label: 'Okay', value: 3 },
  { symbol: '😔', label: 'Not Good', value: 2 },
  { symbol: '😞', label: 'Terrible', value: 1 },
]

// LocalStorage keys
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
  updateStreak()
}

const getMoodHistory = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.MOOD_HISTORY) || '[]')

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

const getStreak = () => parseInt(localStorage.getItem(STORAGE_KEYS.CHECK_IN_STREAK) || '0')

const getAverageStress = () => {
  const data = getWeeklyCheckIns()
  if (data.length === 0) return 0
  return (data.reduce((acc, e) => acc + e.stress, 0) / data.length).toFixed(1)
}

// ============================================
// Box Breathing Exercise
// ============================================
function BoxBreathing({ onBack }) {
  const [active, setActive] = useState(false)
  const [phase, setPhase] = useState('ready')
  const [phaseLabel, setPhaseLabel] = useState('Ready')
  const [countdown, setCountdown] = useState(4)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if (!active) {
      setPhase('ready')
      setPhaseLabel('Ready')
      setCountdown(4)
      setTimer(0)
      return
    }

    const phases = [
      { key: 'inhale', label: 'Inhale' },
      { key: 'hold', label: 'Hold' },
      { key: 'exhale', label: 'Exhale' },
      { key: 'hold', label: 'Hold' },
    ]
    let phaseIndex = 0
    let seconds = 4

    setPhase(phases[0].key)
    setPhaseLabel(phases[0].label)
    setCountdown(4)

    const tick = setInterval(() => {
      seconds--
      if (seconds <= 0) {
        phaseIndex = (phaseIndex + 1) % phases.length
        setPhase(phases[phaseIndex].key)
        setPhaseLabel(phases[phaseIndex].label)
        seconds = 4
      }
      setCountdown(seconds || 4)
      setTimer(prev => prev + 1)
    }, 1000)

    return () => clearInterval(tick)
  }, [active])

  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="fade-in">
      <button className="back-btn" onClick={onBack}>&larr; Back</button>

      <div className="card-elevated text-center">
        <h1 className="mb-s">Box Breathing</h1>
        <p className="text-muted mb-l">4 seconds each: inhale, hold, exhale, hold</p>

        <div className="breathing-circle mb-m">
          <div
            className={`breathing-circle-inner phase-${phase}${active ? ' active' : ''}`}
          >
            <span>{active ? countdown : 'Start'}</span>
          </div>
        </div>

        <div className="mb-m">
          <span className={`phase-indicator ${phase}`}>{phaseLabel}</span>
        </div>

        {active && (
          <p className="text-muted mb-m" style={{ fontSize: '14px' }}>
            Session: {fmt(timer)}
          </p>
        )}

        <button
          className={`btn ${active ? 'btn-secondary' : 'btn-primary'} w-full`}
          onClick={() => setActive(!active)}
          style={{ maxWidth: '280px' }}
        >
          {active ? 'Stop' : 'Start Exercise'}
        </button>
      </div>
    </div>
  )
}

// ============================================
// Progressive Muscle Relaxation
// ============================================
function MuscleRelaxation({ onBack }) {
  const [active, setActive] = useState(false)
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState('tense') // tense or release
  const [countdown, setCountdown] = useState(5)

  const muscles = [
    'Hands — clench your fists',
    'Arms — flex your biceps',
    'Shoulders — shrug upward',
    'Face — scrunch tightly',
    'Chest — take a deep breath and hold',
    'Stomach — tighten your abs',
    'Legs — press thighs together',
    'Feet — curl your toes',
  ]

  useEffect(() => {
    if (!active) {
      setStep(0)
      setPhase('tense')
      setCountdown(5)
      return
    }

    let currentStep = 0
    let currentPhase = 'tense'
    let secs = 5
    setStep(0)
    setPhase('tense')
    setCountdown(5)

    const tick = setInterval(() => {
      secs--
      if (secs <= 0) {
        if (currentPhase === 'tense') {
          currentPhase = 'release'
          secs = 5
        } else {
          currentPhase = 'tense'
          currentStep++
          if (currentStep >= muscles.length) {
            setActive(false)
            return
          }
          secs = 5
        }
        setPhase(currentPhase)
        setStep(currentStep)
      }
      setCountdown(secs || 5)
    }, 1000)

    return () => clearInterval(tick)
  }, [active])

  return (
    <div className="fade-in">
      <button className="back-btn" onClick={onBack}>&larr; Back</button>

      <div className="card-elevated">
        <h1 className="mb-s text-center">Progressive Muscle Relaxation</h1>
        <p className="text-muted mb-l text-center">Tense each muscle group for 5s, then release for 5s</p>

        {active ? (
          <div className="text-center fade-in">
            <p className="text-muted mb-s" style={{ fontSize: '14px' }}>
              Step {step + 1} of {muscles.length}
            </p>
            <h3 className="mb-m">{muscles[step]}</h3>
            <div className="exercise-timer mb-m">{countdown}</div>
            <span className={`phase-indicator ${phase === 'tense' ? 'exhale' : 'inhale'}`}>
              {phase === 'tense' ? 'Tense' : 'Release'}
            </span>
            <div className="mt-l">
              <button className="btn btn-secondary" onClick={() => setActive(false)}>
                Stop
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="grounding-steps mb-l">
              {muscles.map((m, i) => (
                <div key={i} className="grounding-step">
                  <div className="step-number">{i + 1}</div>
                  <div className="step-content">
                    <strong>{m.split(' — ')[0]}</strong>
                    <p>{m.split(' — ')[1]}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary w-full" onClick={() => setActive(true)}>
              Start Exercise
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// 5-4-3-2-1 Grounding Exercise
// ============================================
function GroundingExercise({ onBack }) {
  const [active, setActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { count: 5, sense: 'See', instruction: 'Name 5 things you can see around you' },
    { count: 4, sense: 'Touch', instruction: 'Name 4 things you can physically feel' },
    { count: 3, sense: 'Hear', instruction: 'Name 3 things you can hear right now' },
    { count: 2, sense: 'Smell', instruction: 'Name 2 things you can smell' },
    { count: 1, sense: 'Taste', instruction: 'Name 1 thing you can taste' },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setActive(false)
      setCurrentStep(0)
    }
  }

  return (
    <div className="fade-in">
      <button className="back-btn" onClick={onBack}>&larr; Back</button>

      <div className="card-elevated">
        <h1 className="mb-s text-center">5-4-3-2-1 Grounding</h1>
        <p className="text-muted mb-l text-center">
          Engage your senses to anchor yourself in the present moment
        </p>

        {active ? (
          <div className="fade-in text-center">
            <div className="exercise-timer mb-s">{steps[currentStep].count}</div>
            <h2 className="mb-s">{steps[currentStep].sense}</h2>
            <p className="text-muted mb-l">{steps[currentStep].instruction}</p>
            <p className="text-muted mb-l" style={{ fontSize: '14px' }}>
              Take your time. When ready, continue.
            </p>
            <button className="btn btn-primary w-full" onClick={handleNext} style={{ maxWidth: '280px' }}>
              {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        ) : (
          <div>
            <div className="grounding-steps mb-l">
              {steps.map((s, i) => (
                <div key={i} className="grounding-step">
                  <div className="step-number">{s.count}</div>
                  <div className="step-content">
                    <strong>{s.sense}</strong>
                    <p>{s.instruction}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary w-full" onClick={() => { setActive(true); setCurrentStep(0) }}>
              Start Exercise
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Body Scan Meditation
// ============================================
function BodyScan({ onBack }) {
  const [active, setActive] = useState(false)
  const [step, setStep] = useState(0)
  const [countdown, setCountdown] = useState(10)

  const regions = [
    { name: 'Top of Head', instruction: 'Focus on any sensations at the crown of your head' },
    { name: 'Forehead & Eyes', instruction: 'Release any tension in your brow and around your eyes' },
    { name: 'Jaw & Mouth', instruction: 'Unclench your jaw. Let your tongue rest softly' },
    { name: 'Neck & Shoulders', instruction: 'Let your shoulders drop. Release the neck' },
    { name: 'Arms & Hands', instruction: 'Feel the weight of your arms. Relax your fingers' },
    { name: 'Chest & Heart', instruction: 'Notice your heartbeat. Breathe into your chest' },
    { name: 'Stomach & Core', instruction: 'Soften your belly. Let it rise and fall naturally' },
    { name: 'Hips & Lower Back', instruction: 'Release any tightness in your lower back' },
    { name: 'Legs & Feet', instruction: 'Feel the ground beneath you. Relax your toes' },
  ]

  useEffect(() => {
    if (!active) {
      setStep(0)
      setCountdown(10)
      return
    }

    let currentStep = 0
    let secs = 10
    setStep(0)
    setCountdown(10)

    const tick = setInterval(() => {
      secs--
      if (secs <= 0) {
        currentStep++
        if (currentStep >= regions.length) {
          setActive(false)
          return
        }
        setStep(currentStep)
        secs = 10
      }
      setCountdown(secs || 10)
    }, 1000)

    return () => clearInterval(tick)
  }, [active])

  return (
    <div className="fade-in">
      <button className="back-btn" onClick={onBack}>&larr; Back</button>

      <div className="card-elevated">
        <h1 className="mb-s text-center">Body Scan</h1>
        <p className="text-muted mb-l text-center">
          Slowly scan through each body region. 10 seconds per area.
        </p>

        {active ? (
          <div className="text-center fade-in">
            <p className="text-muted mb-s" style={{ fontSize: '14px' }}>
              Region {step + 1} of {regions.length}
            </p>
            <h2 className="mb-s">{regions[step].name}</h2>
            <p className="text-muted mb-m">{regions[step].instruction}</p>
            <div className="exercise-timer mb-m">{countdown}</div>
            <div className="progress-bar mb-l">
              <div
                className="progress-fill"
                style={{ width: `${((step + 1) / regions.length) * 100}%` }}
              ></div>
            </div>
            <button className="btn btn-secondary" onClick={() => setActive(false)}>
              Stop
            </button>
          </div>
        ) : (
          <div>
            <div className="grounding-steps mb-l">
              {regions.map((r, i) => (
                <div key={i} className="grounding-step">
                  <div className="step-number">{i + 1}</div>
                  <div className="step-content">
                    <strong>{r.name}</strong>
                    <p>{r.instruction}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary w-full" onClick={() => setActive(true)}>
              Start Body Scan
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Exercise Selection Hub
// ============================================
function ExerciseHub({ onBack, navigateTo }) {
  return (
    <div className="fade-in">
      <button className="back-btn" onClick={onBack}>&larr; Back</button>

      <h1 className="mb-s">Stress Relief Exercises</h1>
      <p className="text-muted mb-l">Choose an exercise that suits your needs</p>

      <div className="exercise-grid mb-l">
        <button className="exercise-card" onClick={() => navigateTo('breathe-box')}>
          <h4>Box Breathing</h4>
          <p>Calm anxiety with rhythmic breathing</p>
        </button>
        <button className="exercise-card" onClick={() => navigateTo('breathe-muscle')}>
          <h4>Muscle Relaxation</h4>
          <p>Release physical tension step by step</p>
        </button>
        <button className="exercise-card" onClick={() => navigateTo('breathe-ground')}>
          <h4>5-4-3-2-1 Grounding</h4>
          <p>Anchor yourself using all five senses</p>
        </button>
        <button className="exercise-card" onClick={() => navigateTo('breathe-scan')}>
          <h4>Body Scan</h4>
          <p>Guided meditation through body regions</p>
        </button>
      </div>
    </div>
  )
}

// ============================================
// Main App Component
// ============================================
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

  const helpers = [
    {
      name: "AASRA",
      phone: "+912227546669",
      whatsapp: "9191227546669",
      email: "aasrahelpline@gmail.com"
    },
    {
      name: "Vandrevala Foundation",
      phone: "+9118602662345",
      whatsapp: "918602662345",
      email: "support@vandrevalafoundation.com"
    },
    {
      name: "iCall",
      phone: "+912225521111",
      whatsapp: null,
      email: "icall@tiss.edu"
    }
  ]

  useEffect(() => {
    setWeeklyCheckIns(getWeeklyCheckIns().length)
    setStreak(getStreak())
    setAvgStress(getAverageStress())

    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)

    const lastCheckIn = localStorage.getItem(STORAGE_KEYS.LAST_CHECK_IN)
    if (lastCheckIn && new Date(lastCheckIn).toDateString() === new Date().toDateString()) {
      setCheckInComplete(true)
    }

    const handleBIP = (e) => { e.preventDefault(); setDeferredPrompt(e); setShowInstallPrompt(true) }
    window.addEventListener('beforeinstallprompt', handleBIP)
    return () => window.removeEventListener('beforeinstallprompt', handleBIP)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEYS.THEME, next)
      document.documentElement.setAttribute('data-theme', next)
      return next
    })
  }, [])

  const toggleSidebar = useCallback(() => setSidebarOpen(p => !p), [])
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const navigateTo = useCallback((view) => {
    setCurrentView(view)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowInstallPrompt(false)
    setDeferredPrompt(null)
  }

  const handleCheckInSubmit = () => {
    if (selectedMood && stressLevel) {
      saveMoodCheckIn(selectedMood, stressLevel)
      setCheckInComplete(true)
      setWeeklyCheckIns(getWeeklyCheckIns().length)
      setStreak(getStreak())
      setAvgStress(getAverageStress())
      setTimeout(() => { setSelectedMood(null); setStressLevel(null) }, 3000)
    }
  }

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h >= 0 && h < 4) return '🌙 Good Midnight'     // Midnight – early night
    if (h >= 4 && h < 6) return '🌅 Good Dawn'         // Dawn - early morning
    if (h >= 6 && h < 12) return '☀️ Good Morning'     // Morning
    if (h === 12) return '🕛 Good Noon'                // Noon - exact Afternoon
    if (h > 12 && h < 17) return '🌤️ Good Afternoon'   // Afternoon
    if (h >= 17 && h < 20) return '🌇 Good Evening'    // Evening - early night
    return '🌌 Good Night'                             // Night - late night
  }

  // ============================================
  // RENDER: Home
  // ============================================
  const renderHome = () => (
    <div className="fade-in">
      {showInstallPrompt && (
        <div className="notification mb-l">
          <div className="flex-between flex-wrap gap-m">
            <div style={{ flex: 1, minWidth: '200px' }}>
              <strong>Install App</strong>
              <p style={{ marginBottom: 0, fontSize: '14px', marginTop: '4px' }}>
                Install for quick access and offline support
              </p>
            </div>
            <div className="flex gap-s">
              <button className="btn btn-primary" onClick={handleInstallClick}>Install</button>
              <button className="btn btn-secondary" onClick={() => setShowInstallPrompt(false)}>Later</button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-xl">
        <h1>{getGreeting()}</h1>
        <p className="text-muted">Welcome back to your safe space</p>
        {streak > 0 && <div className="streak-badge">{streak} day streak</div>}
      </div>

      <div className="card-elevated mb-l">
        <h2 className="mb-m">Daily Check-In</h2>
        {!checkInComplete ? (
          <>
            <p className="text-muted mb-l">How are you feeling today?</p>
            <div className="mood-selector mb-l">
              {MOODS.map((mood) => (
                <div
                  key={mood.value}
                  className={`mood-option ${selectedMood?.value === mood.value ? 'selected' : ''}`}
                  onClick={() => setSelectedMood(mood)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${mood.label}`}
                  title={mood.label}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedMood(mood)}
                >
                  {mood.symbol}
                </div>
              ))}
            </div>
            {selectedMood && (
              <div className="fade-in">
                <p className="text-muted mb-m">Stress level (1–5)</p>
                <div className="stress-selector mb-l">
                  <div className="stress-labels">
                    <span className="text-muted" style={{ fontSize: '12px' }}>Low</span>
                    <span className="text-muted" style={{ fontSize: '12px' }}>High</span>
                  </div>
                  <div className="stress-options">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        className={`stress-btn ${stressLevel === level ? 'selected' : ''}`}
                        onClick={() => setStressLevel(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                {stressLevel && (
                  <button className="btn btn-primary w-full" onClick={handleCheckInSubmit}>
                    Complete Check-In
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center fade-in">
            <div style={{ fontSize: '36px', marginBottom: '16px', fontWeight: 700 }}>Done</div>
            <h3>Check-In Complete</h3>
            <p className="text-muted">Thank you for sharing how you're feeling</p>
          </div>
        )}
      </div>

      <div className="text-center mb-l">
        <button className="btn btn-emergency" onClick={() => navigateTo('emergency')}>
          Need Help Now?
        </button>
      </div>

      <div className="card mb-l">
        <h3 className="mb-m">Weekly Progress</h3>
        <div className="mb-m">
          <div className="flex-between" style={{ marginBottom: '8px' }}>
            <span className="text-muted">Check-ins</span>
            <span style={{ fontWeight: 600 }}>{weeklyCheckIns}/7</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min((weeklyCheckIns / 7) * 100, 100)}%` }}></div>
          </div>
        </div>
        {avgStress > 0 && (
          <p className="text-muted" style={{ fontSize: '14px', marginBottom: 0 }}>
            Avg. stress: {avgStress}/5
          </p>
        )}
      </div>

      <div className="card">
        <h3 className="mb-m">Quick Actions</h3>
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => navigateTo('chat')}>
            <span className="quick-action-icon">Chat</span>
            <span className="quick-action-label">AI Support</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigateTo('breathe')}>
            <span className="quick-action-icon">Calm</span>
            <span className="quick-action-label">Exercises</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigateTo('community')}>
            <span className="quick-action-icon">Talk</span>
            <span className="quick-action-label">Community</span>
          </button>
        </div>
      </div>
    </div>
  )

  // ============================================
  // RENDER: Emergency
  // ============================================
  const renderEmergency = () => (
    <div className="emergency-screen fade-in">
      <button className="back-btn" onClick={() => navigateTo('home')}>&larr; Back</button>
      <div className="card-elevated">
        <div className="text-center mb-l">
          <h1>You Don't Have to Face This Alone</h1>
          <p className="text-muted">Please reach out to someone who can help:</p>
        </div>
        <div className="divider mb-l"></div>
        <h3 className="mb-m">Crisis Helplines (24/7)</h3>
        {helpers.map((helper, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              marginBottom: "10px"
            }}
          >
            {/* Left: Name */}
            <span style={{ fontWeight: 600, fontSize: "16px" }}>
              {helper.name}
            </span>

            {/* Right: Actions */}
            <div style={{ display: "flex", gap: "10px" }}>

              {/* Call */}
              <a
                href={`tel:${helper.phone}`}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #0d6efd",
                  color: "#0d6efd",
                  background: "transparent",
                  transition: "all 0.2s ease",
                  textDecoration: "none"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#0d6efd"
                  e.currentTarget.style.color = "#fff"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "#0d6efd"
                }}
              >
                <FiPhoneCall />
              </a>

              {/* WhatsApp (only if exists) */}
              {helper.whatsapp && (
                <a
                  href={`https://wa.me/${helper.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #25d366",
                    color: "#25d366",
                    background: "transparent",
                    transition: "all 0.2s ease",
                    textDecoration: "none"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#25d366"
                    e.currentTarget.style.color = "#fff"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.color = "#25d366"
                  }}
                >
                  <FaWhatsapp />
                </a>
              )}

              {/* Mail */}
              <a
                href={`mailto:${helper.email}`}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #6c757d",
                  color: "#6c757d",
                  background: "transparent",
                  transition: "all 0.2s ease",
                  textDecoration: "none"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#6c757d"
                  e.currentTarget.style.color = "#fff"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "#6c757d"
                }}
              >
                <FiMail />
              </a>

            </div>
          </div>
        ))}


        {/* <a href="tel:912227546669" className="helpline-card mb-m" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="helpline-info">
            <strong>AASRA</strong>
            <p className="text-muted" style={{ marginBottom: 0 }}>91-22-27546669</p>
          </div>
          <button className="btn btn-primary">Call</button>
        </a>
        <a href="tel:18602662345" className="helpline-card mb-m" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="helpline-info">
            <strong>Vandrevala Foundation</strong>
            <p className="text-muted" style={{ marginBottom: 0 }}>1860-2662-345</p>
          </div>
          <button className="btn btn-primary">Call</button>
        </a>
        <a href="tel:912225521111" className="helpline-card mb-l" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="helpline-info">
            <strong>iCall</strong>
            <p className="text-muted" style={{ marginBottom: 0 }}>91-22-25521111</p>
          </div>
          <button className="btn btn-primary">Call</button>
        </a> */}
        <div className="divider mb-l"></div>
        <button className="btn btn-primary w-full" onClick={() => navigateTo('home')}>
          I'm Safe Now
        </button>
      </div>
    </div>
  )

  // ============================================
  // RENDER: Chat
  // ============================================
  const renderChat = () => (
    <div className="fade-in">
      <button className="back-btn" onClick={() => navigateTo('home')}>&larr; Back</button>
      <div className="card-elevated">
        <h1 className="mb-m">AI Support Chat</h1>
        <div className="notification mb-l">
          <p style={{ marginBottom: 0, fontSize: '14px' }}>
            <strong>Note:</strong> I'm here to listen, but I'm not a therapist.
            For professional help, reach out to a licensed mental health professional.
          </p>
        </div>
        <div className="chat-messages mb-m">
          <div className="chat-message ai-message">
            <p style={{ marginBottom: 0 }}>Hello! I'm here to listen without judgment. How are you feeling today?</p>
          </div>
        </div>
        <div className="chat-input-container">
          <textarea placeholder="Type your message..." rows="3" style={{ marginBottom: '12px' }}></textarea>
          <button className="btn btn-primary w-full">Send</button>
        </div>
      </div>
    </div>
  )

  // ============================================
  // RENDER: Community
  // ============================================
  const renderCommunity = () => (
    <div className="fade-in">
      <button className="back-btn" onClick={() => navigateTo('home')}>&larr; Back</button>
      <div className="card-elevated">
        <h1 className="mb-m">Peer Support Community</h1>
        <p className="text-muted mb-l">Connect with others facing similar challenges</p>
        <div className="topic-rooms mb-l">
          <button className="topic-room-btn">Early-Career Stress</button>
          <button className="topic-room-btn">Family Expectations</button>
          <button className="topic-room-btn">Burnout & Exhaustion</button>
          <button className="topic-room-btn">Hope & Progress</button>
        </div>
      </div>
    </div>
  )

  const renderInfoPage = (Page) => (
    <div>
      <button className="back-btn" onClick={() => navigateTo('home')}>&larr; Back</button>
      <Page />
    </div>
  )

  // ============================================
  // MAIN RETURN
  // ============================================
  return (
    <div className="app">
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={closeSidebar} aria-label="Close menu">&times;</button>
        </div>
        <nav className="sidebar-nav">
          <button className={`sidebar-link ${currentView === 'home' ? 'active' : ''}`} onClick={() => navigateTo('home')}>
            <span className="sidebar-icon">&#9679;</span>
            <span>Home</span>
          </button>
          <button className={`sidebar-link ${currentView === 'chat' ? 'active' : ''}`} onClick={() => navigateTo('chat')}>
            <span className="sidebar-icon">&#9998;</span>
            <span>AI Support Chat</span>
          </button>
          <button className={`sidebar-link ${currentView === 'breathe' ? 'active' : ''}`} onClick={() => navigateTo('breathe')}>
            <span className="sidebar-icon">&#9673;</span>
            <span>Exercises</span>
          </button>
          <button className={`sidebar-link ${currentView === 'community' ? 'active' : ''}`} onClick={() => navigateTo('community')}>
            <span className="sidebar-icon">&#9733;</span>
            <span>Community</span>
          </button>
          <button className={`sidebar-link ${currentView === 'emergency' ? 'active' : ''}`} onClick={() => navigateTo('emergency')}>
            <span className="sidebar-icon">&#9888;</span>
            <span>Emergency</span>
          </button>

          <div className="sidebar-divider"></div>

          <button className={`sidebar-link ${currentView === 'about' ? 'active' : ''}`} onClick={() => navigateTo('about')}>
            <span className="sidebar-icon">&#9432;</span>
            <span>About</span>
          </button>
          <button className={`sidebar-link ${currentView === 'services' ? 'active' : ''}`} onClick={() => navigateTo('services')}>
            <span className="sidebar-icon">&#9881;</span>
            <span>Services</span>
          </button>
          <button className={`sidebar-link ${currentView === 'privacy' ? 'active' : ''}`} onClick={() => navigateTo('privacy')}>
            <span className="sidebar-icon">&#9670;</span>
            <span>Privacy</span>
          </button>
          <button className={`sidebar-link ${currentView === 'contact' ? 'active' : ''}`} onClick={() => navigateTo('contact')}>
            <span className="sidebar-icon">&#9993;</span>
            <span>Contact</span>
          </button>

          <div className="sidebar-divider"></div>

          <div className="theme-toggle-row">
            <span className="theme-toggle-label">
              <span className="sidebar-icon">&#9788;</span>
              Dark Mode
            </span>
            <label className="toggle-switch">
              <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} aria-label="Toggle dark mode" />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </nav>
      </aside>

      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div className="header-inner">
            <button className="icon-btn" onClick={toggleSidebar} aria-label="Open menu">&#9776;</button>
            <h3 className="header-title">Early Distress Support</h3>
            <label className="toggle-switch" style={{ marginRight: '4px' }}>
              <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} aria-label="Toggle dark mode" />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="main-container">
          {currentView === 'home' && renderHome()}
          {currentView === 'emergency' && renderEmergency()}
          {currentView === 'breathe' && <ExerciseHub onBack={() => navigateTo('home')} navigateTo={navigateTo} />}
          {currentView === 'breathe-box' && <BoxBreathing onBack={() => navigateTo('breathe')} />}
          {currentView === 'breathe-muscle' && <MuscleRelaxation onBack={() => navigateTo('breathe')} />}
          {currentView === 'breathe-ground' && <GroundingExercise onBack={() => navigateTo('breathe')} />}
          {currentView === 'breathe-scan' && <BodyScan onBack={() => navigateTo('breathe')} />}
          {currentView === 'chat' && renderChat()}
          {currentView === 'community' && renderCommunity()}
          {currentView === 'about' && renderInfoPage(AboutPage)}
          {currentView === 'services' && renderInfoPage(ServicesPage)}
          {currentView === 'privacy' && renderInfoPage(PrivacyPage)}
          {currentView === 'contact' && renderInfoPage(ContactPage)}
          {currentView === 'terms' && renderInfoPage(TermsPage)}
          {currentView === 'disclaimer' && renderInfoPage(DisclaimerPage)}
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
              <button className="footer-link" onClick={() => navigateTo('about')}>About</button>
              <button className="footer-link" onClick={() => navigateTo('services')}>Services</button>
              <button className="footer-link" onClick={() => navigateTo('emergency')}>Crisis Support</button>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <button className="footer-link" onClick={() => navigateTo('privacy')}>Privacy</button>
              <button className="footer-link" onClick={() => navigateTo('terms')}>Terms</button>
              <button className="footer-link" onClick={() => navigateTo('disclaimer')}>Disclaimer</button>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <button className="footer-link" onClick={() => navigateTo('contact')}>Contact Us</button>
              <p className="footer-text">support@distresssupport.app</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Early Distress Support App. All rights reserved.</p>
            <p className="footer-disclaimer">
              This app supports well-being but does not replace professional mental health care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
