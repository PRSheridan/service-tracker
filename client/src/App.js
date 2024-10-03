import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar.js"
import Login from "./pages/Login.js"

function App() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

//check if there is a user session in cookies
//assign user, and redirect to /CalendarList
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
        <div className="title in-line">service-tracker</div>
        {user ? <div className="username-display in-line">{user.username}</div> : <></>}
        <NavBar user={user} setUser={setUser}/>
      </div>
      <div id="app-container">
        <Outlet />
      </div>
    </>
  )
}

export default App;