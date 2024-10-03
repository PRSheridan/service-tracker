import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

function Login({ onLogin }) {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <>
            <div>
                <div>service-tracker</div>
            </div>
            <div>
            {showLogin ? (
                <div>
                <div>
                    <LoginForm onLogin={onLogin} />
                    <p>No account? Create one here
                        <button onClick={() => setShowLogin(false)}>
                            Signup
                        </button>
                    </p>
                </div>
                </div>
                ) : (
                <div>
                <div>
                    <SignupForm onLogin={onLogin} />
                    <p>Already have an account? Sign in here
                        <button onClick={() => setShowLogin(true)}>
                            Login
                        </button>
                    </p>
                </div>
                </div>
                )}
            </div>
        </>
    );
}

export default Login;