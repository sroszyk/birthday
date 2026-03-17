export default function RulesScreen({ config, onContinue }) {
  return (
    <div className="screen rules-screen">
      <div className="rules-card">
        <h1 className="rules-title">{config.title}</h1>
        <div className="rules-divider" />
        <p className="rules-text">{config.text}</p>
        <button className="btn-primary" onClick={onContinue}>
          {config.buttonText}
        </button>
      </div>
    </div>
  )
}
