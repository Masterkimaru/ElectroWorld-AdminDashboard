import React, { useState, useEffect } from 'react';
import './Login.css'; // We'll create this CSS file

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [currentPattern, setCurrentPattern] = useState<string[]>([]);
  const [userPattern, setUserPattern] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPattern, setShowPattern] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'welcome' | 'pattern' | 'input'>('welcome');

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const colorMap = {
    red: '#ff4757',
    blue: '#3742fa',
    green: '#2ed573',
    yellow: '#ffa502',
    purple: '#a55eea',
    orange: '#ff6348'
  };

  // Generate a random pattern of 4-6 colors
  const generateRandomPattern = () => {
    const patternLength = Math.floor(Math.random() * 3) + 4; // 4-6 length
    const pattern = [];
    for (let i = 0; i < patternLength; i++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      pattern.push(randomColor);
    }
    return pattern;
  };

  // Initialize with a random pattern
  useEffect(() => {
    setCurrentPattern(generateRandomPattern());
  }, []);

  const startChallenge = () => {
    setStep('pattern');
    setShowPattern(true);
    
    // Hide pattern after 3 seconds
    setTimeout(() => {
      setShowPattern(false);
      setStep('input');
    }, 3000);
  };

  const handleColorClick = (color: string) => {
    if (step !== 'input') return;

    const newUserPattern = [...userPattern, color];
    setUserPattern(newUserPattern);

    // Check if pattern matches so far
    if (currentPattern[newUserPattern.length - 1] !== color) {
      setError('Wrong pattern! Try again.');
      setTimeout(() => {
        resetChallenge();
      }, 1500);
      return;
    }

    // Check if pattern is complete
    if (newUserPattern.length === currentPattern.length) {
      setIsLoading(true);
      setTimeout(() => {
        localStorage.setItem('adminAuthenticated', 'true');
        onLogin();
      }, 1000);
    }
  };

  const resetChallenge = () => {
    setUserPattern([]);
    setError('');
    setCurrentPattern(generateRandomPattern());
    setStep('welcome');
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="animated-bg">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${Math.random() * 10 + 10}s`
          }}></div>
        ))}
      </div>

      <div className="login-card">
        <div className="login-header">
          <h1>Admin Dashboard</h1>
          <p>Pattern Authentication Required</p>
        </div>

        {step === 'welcome' && (
          <div className="welcome-step">
            <div className="lock-icon">🔒</div>
            <p>Click the button to see your unique access pattern</p>
            <button className="start-btn" onClick={startChallenge}>
              Start Authentication
            </button>
          </div>
        )}

        {step === 'pattern' && (
          <div className="pattern-display">
            <h3>Memorize this sequence:</h3>
            <div className="pattern-preview">
              {currentPattern.map((color, index) => (
                <div
                  key={index}
                  className={`pattern-dot ${showPattern ? 'show' : ''}`}
                  style={{ 
                    backgroundColor: colorMap[color as keyof typeof colorMap],
                    animationDelay: `${index * 0.3}s`
                  }}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <p className="countdown">Pattern will disappear soon...</p>
          </div>
        )}

        {step === 'input' && (
          <div className="input-step">
            <h3>Now click the colors in order:</h3>
            
            {/* Progress indicator */}
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(userPattern.length / currentPattern.length) * 100}%` }}
              ></div>
            </div>
            <p className="progress-text">
              {userPattern.length} / {currentPattern.length} colors entered
            </p>

            {/* Color buttons */}
            <div className="color-grid">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`color-btn ${userPattern.includes(color) ? 'used' : ''}`}
                  style={{ backgroundColor: colorMap[color as keyof typeof colorMap] }}
                  onClick={() => handleColorClick(color)}
                  disabled={isLoading}
                >
                  <span className="color-name">{color}</span>
                </button>
              ))}
            </div>

            <button className="reset-btn" onClick={resetChallenge}>
              New Pattern
            </button>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>❌ {error}</span>
          </div>
        )}

        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Authenticating...</p>
          </div>
        )}

        
      </div>
      {/* Branding */}
        <div className="powered-by">
          <span>Powered by </span>
          <strong>MasterKimaru</strong>
          <div className="sparkle">✨</div>
        </div>
    </div>
  );
};

export default Login;
