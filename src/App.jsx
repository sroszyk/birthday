import { useState, useEffect, useCallback } from 'react'
import StartScreen from './screens/StartScreen'
import RulesScreen from './screens/RulesScreen'
import StepScreen from './screens/StepScreen'
import FinalScreen from './screens/FinalScreen'
import './App.css'

const STORAGE_KEY = 'birthday_progress'

function getSavedProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    // ignore invalid stored data
  }
  return null
}

function saveProgress(screen, stepIndex) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ screen, stepIndex }))
  } catch {
    // ignore storage errors
  }
}

function App() {
  const [screen, setScreen] = useState('start')
  const [stepIndex, setStepIndex] = useState(0)
  const [config, setConfig] = useState(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}config.json`)
      .then((r) => r.json())
      .then(setConfig)
      .catch(console.error)
  }, [])

  const navigate = useCallback((nextScreen, nextStep = 0) => {
    setVisible(false)
    setTimeout(() => {
      setScreen(nextScreen)
      setStepIndex(nextStep)
      setVisible(true)
      saveProgress(nextScreen, nextStep)
    }, 420)
  }, [])

  const handleStart = useCallback(() => {
    const saved = getSavedProgress()
    if (saved && saved.screen && saved.screen !== 'start') {
      if (saved.screen === 'step') {
        const savedStep = saved.stepIndex ?? 0
        if (savedStep >= 0 && savedStep < config.steps.length) {
          navigate('step', savedStep)
        } else {
          navigate('rules')
        }
      } else {
        navigate(saved.screen, 0)
      }
    } else {
      navigate('rules')
    }
  }, [config, navigate])

  if (!config) {
    return <div className="loading">❤</div>
  }

  return (
    <div className={`screen-wrapper ${visible ? 'visible' : 'hidden'}`}>
      {screen === 'start' && (
        <StartScreen onStart={handleStart} />
      )}
      {screen === 'rules' && (
        <RulesScreen config={config.rules} onContinue={() => navigate('step', 0)} />
      )}
      {screen === 'step' && (
        <StepScreen
          key={stepIndex}
          step={config.steps[stepIndex]}
          stepNumber={stepIndex + 1}
          totalSteps={config.steps.length}
          onNext={() => {
            if (stepIndex < config.steps.length - 1) {
              navigate('step', stepIndex + 1)
            } else {
              navigate('final')
            }
          }}
        />
      )}
      {screen === 'final' && <FinalScreen config={config.final} />}
    </div>
  )
}

export default App
