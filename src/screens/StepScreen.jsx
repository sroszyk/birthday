import { useState, useRef, useEffect } from 'react'

export default function StepScreen({ step, stepNumber, totalSteps, onNext }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef(null)

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }, [])

  const handleChange = (e) => {
    setCode(e.target.value.toUpperCase())
    setError(false)
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').toUpperCase()
    setCode(pasted)
    setError(false)
  }

  const handleSubmit = () => {
    if (!code.trim()) {
      triggerError()
      return
    }
    if (code === step.code.toUpperCase()) {
      onNext()
    } else {
      triggerError()
    }
  }

  const triggerError = () => {
    setError(true)
    setShaking(true)
    setTimeout(() => setShaking(false), 450)
  }

  return (
    <div className="screen step-screen">
      <div className="step-card">
        <p className="step-indicator">
          Krok {stepNumber} z {totalSteps}
        </p>

        {step.type === 'text' ? (
          <p className="step-content-text">{step.content}</p>
        ) : (
          <div className="step-image-wrapper">
            <img
              src={`${import.meta.env.BASE_URL}${step.content}`}
              alt={`Wskazówka ${stepNumber}`}
            />
          </div>
        )}

        <div className="code-section">
          <span className="code-label">Wpisz kod</span>
          <input
            ref={inputRef}
            type="text"
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            value={code}
            className={`code-input${error ? ' error' : ''}${shaking ? ' shake' : ''}`}
            onChange={handleChange}
            onPaste={handlePaste}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {error && (
            <p className="validation-msg" key={String(shaking)}>
              {step.validationMessage}
            </p>
          )}
        </div>

        <button
          className="btn-primary"
          onClick={handleSubmit}
        >
          {step.buttonText}
        </button>
      </div>
    </div>
  )
}
