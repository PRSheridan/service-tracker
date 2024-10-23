import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar.js"
import Login from "./pages/Login.js"

function App() {
  const [user, setUser] = useState(null)
  const [queues, setQueues] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'service-tracker'
    fetch("/check_session")
    .then((response) => {
      if (response.ok) {
         response.json().then((user) => setUser(user)) 
         navigate("/Home")
      }
    }).then(
      fetch("/queues")
      .then((response) => {
        response.json().then((queues) => setQueues(queues))
        console.log(queues)
      })
    )
  }, [])

  if (!user) return <Login onLogin={setUser}/>
  return (
    <>
      <div className="header">
        <div className="header-content">
          <h1 className="title in-line">Service Tracker</h1>
          <NavBar user={user} setUser={setUser}/>
        </div>
      </div>
      <div id="app-container">
        <Outlet context={{user, setUser, queues, setQueues}} />
      </div>
    </>
  )
}

export default App;