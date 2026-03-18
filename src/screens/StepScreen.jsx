import { useState, useRef, useEffect } from 'react'

export default function StepScreen({ step, onNext }) {
  const codeLength = step.code.length
  const [digits, setDigits] = useState(Array(codeLength).fill(''))
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const inputRefs = useRef([])

  // Focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus()
    }, 100)
  }, [])

  const handleChange = (index, e) => {
    const raw = e.target.value.toUpperCase().replace(/\s/g, '')
    const val = raw.slice(-1)
    const newDigits = [...digits]

    if (val) {
      newDigits[index] = val
      setDigits(newDigits)
      setError(false)
      if (index < codeLength - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    } else {
      // Value was cleared
      newDigits[index] = ''
      setDigits(newDigits)
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const newDigits = [...digits]
        newDigits[index] = ''
        setDigits(newDigits)
        setError(false)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle mobile backspace via onInput
  const handleInput = (index, e) => {
    if (
      e.nativeEvent.inputType === 'deleteContentBackward' &&
      !digits[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').toUpperCase().replace(/\s/g, '').slice(0, codeLength)
    if (!pasted) return
    const newDigits = [...digits]
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i]
    }
    setDigits(newDigits)
    setError(false)
    const nextFocus = Math.min(pasted.length, codeLength - 1)
    inputRefs.current[nextFocus]?.focus()
  }

  const handleSubmit = () => {
    const entered = digits.join('')
    if (entered.length < codeLength) {
      triggerError()
      return
    }
    if (entered.toUpperCase() === step.code.toUpperCase()) {
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
        <div className="step-ornament" aria-hidden="true">
          <svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="8" y1="20" x2="76" y2="20" stroke="url(#ornGrad)" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="24" cy="20" r="2.5" fill="url(#ornGrad)"/>
            <circle cx="42" cy="20" r="2" fill="url(#ornGrad)" opacity="0.65"/>
            <circle cx="60" cy="20" r="2.5" fill="url(#ornGrad)"/>
            <path d="M100 9 L102.9 17.6 L112 17.6 L104.5 22.8 L107.4 31.4 L100 26.2 L92.6 31.4 L95.5 22.8 L88 17.6 L97.1 17.6 Z" fill="url(#ornGrad)"/>
            <circle cx="140" cy="20" r="2.5" fill="url(#ornGrad)"/>
            <circle cx="158" cy="20" r="2" fill="url(#ornGrad)" opacity="0.65"/>
            <circle cx="176" cy="20" r="2.5" fill="url(#ornGrad)"/>
            <line x1="124" y1="20" x2="192" y2="20" stroke="url(#ornGrad)" strokeWidth="1.5" strokeLinecap="round"/>
            <defs>
              <linearGradient id="ornGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e8a0bf"/>
                <stop offset="50%" stopColor="#c47ab7"/>
                <stop offset="100%" stopColor="#a05aa0"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {step.type === 'text' ? (
          <p className="step-content-text">{step.content}</p>
        ) : (
          <div className="step-image-wrapper">
            <img
              src={`${import.meta.env.BASE_URL}${step.content}`}
              alt={`Wskazówka - ${step.id}`}
            />
          </div>
        )}

        <div className="code-section">
          <span className="code-label">Wpisz kod</span>
          <div className="code-inputs" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                autoCapitalize="characters"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                maxLength={1}
                value={digit}
                className={`code-digit${error ? ' error' : ''}${shaking ? ' shake' : ''}`}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onInput={(e) => handleInput(i, e)}
              />
            ))}
          </div>
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
