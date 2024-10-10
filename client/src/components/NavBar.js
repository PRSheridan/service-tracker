import React from "react";
import { NavLink } from "react-router-dom";

function NavBar({ user, setUser }) {

  function handleLogoutClick() {
    fetch("/logout", { method: "DELETE" }).then((r) => { if (r.ok) { 
      setUser(null)
    }})
  }

  return (
    <nav id="navbar">
      <NavLink
        to={{pathname: "/home"}}
        className="nav-link nav-button"
        >Home
      </NavLink>
      <NavLink 
        to={{pathname: "/new_ticket"}}
        className="nav-link nav-button">
        New ticket  
      </NavLink>
      <NavLink
        to={{pathname: "/profile"}}
        className="nav-link nav-button"
        >Profile
      </NavLink>
      {user ? <div className="username-display in-line">{user.username}</div> : <></>}
      <NavLink className="nav-link nav-button" onClick={handleLogoutClick}>
        LOGOUT  
      </NavLink>
    </nav>
  )
}

export default NavBar