import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar.js"
import Login from "./pages/Login.js"

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'service-tracker'
    fetch("/check_session")
    .then((response) => {
      if (response.ok) {
         response.json().then((user) => setUser(user)) 
         navigate("/Home")
      }
    })
  }, [])

  if (!user) return <Login onLogin={setUser}/>
  return (
    <>
      <div className="header">
        <h1 className="title in-line">service-tracker</h1>
        {user ? <div className="username-display in-line">{user.username}</div> : <></>}
        <NavBar user={user} setUser={setUser}/>
      </div>
      <div id="app-container">
        <Outlet context={{user, setUser}} />
      </div>
    </>
  )
}

export default App;