import { useState } from "react"
import LoginForm from "../forms/LoginForm"
import SignupForm from "../forms/SignupForm"

function Login({ onLogin }) {
  const [showLogin, setShowLogin] = useState(true)

  return (
    <>
      <div className="header">
        <div className="header-content">
          <h1 className="title">Service Tracker</h1>
        </div>
      </div>
      <div className="login-signup-container">
        {showLogin ? (
          <div className="login-container">
            <LoginForm onLogin={onLogin} />
            <p className="toggle-text">
              No account? Create one here
              <button
                className="toggle-button"
                onClick={() => setShowLogin(false)}
              >
                Signup
              </button>
            </p>
          </div>
        ) : (
          <div className="signup-container">
            <SignupForm onLogin={onLogin} />
            <p className="toggle-text">
              Already have an account? Sign in here
              <button
                className="toggle-button"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default Login

