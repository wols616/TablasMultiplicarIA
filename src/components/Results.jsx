import React from 'react';

const Results = ({ correctCount, totalQuestions, message, onRestart }) => {
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const errorPercentage = 100 - percentage;
  const isGoodPerformance = percentage >= 75;

  return (
    <div className="results-container">
      <div className="results-card">
        <div className="results-animation">
          {isGoodPerformance ? (
            <div className="celebration">😄</div>
          ) : (
            <div className="studying">
              📚
              <div className="book-animation">📖</div>
            </div>
          )}
        </div>

        <h2 className="results-title">
          {isGoodPerformance ? '¡Excelente Trabajo!' : '¡Buen Intento!'}
        </h2>

        <p className="results-message ai-message">{message}</p>

        <div className="results-stats">
          <div className="stat">
            <p className="stat-label">Porcentaje de Acierto</p>
            <p className="stat-value">{percentage}%</p>
          </div>
          <div className="stat">
            <p className="stat-label">Porcentaje de Error</p>
            <p className="stat-value error-stat">{errorPercentage}%</p>
          </div>
          <div className="stat">
            <p className="stat-label">Respuestas Correctas</p>
            <p className="stat-value">{correctCount}</p>
          </div>
          <div className="stat">
            <p className="stat-label">Respuestas Incorrectas</p>
            <p className="stat-value error-stat">{totalQuestions - correctCount}</p>
          </div>
        </div>

        <div className="progress-circle">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <g transform="rotate(-90 60 60)">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={isGoodPerformance ? '#4CAF50' : '#FF9800'}
                strokeWidth="8"
                strokeDasharray={`${(percentage / 100) * 314} 314`}
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
            </g>
          </svg>
          <div className="percentage-text">{percentage}%</div>
        </div>

        <button className="restart-button" onClick={onRestart}>
          🔄 Intentar Nuevamente
        </button>
      </div>
    </div>
  );
};

export default Results;
