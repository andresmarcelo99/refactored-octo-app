import { useState } from 'react';

export function Login({ onLogin }: any) {
  const [inputValue, setInputValue] = useState('');

  const loginButtonDisabled = inputValue.trim().length === 0;

  return (
    <div className="login">
      <span className="login-title">Login to your account</span>
      <input
        className="input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        disabled={loginButtonDisabled}
        className="button"
        onClick={() => onLogin({ nickname: inputValue, id: 1 })}
      >
        Login
      </button>
    </div>
  );
}
