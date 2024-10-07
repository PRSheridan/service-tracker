import React from "react";
import { NavLink } from "react-router-dom";

function NavBar({ setUser }) {

  function handleLogoutClick() {
    fetch("/logout", { method: "DELETE" }).then((r) => { if (r.ok) { 
      setUser(null)
    }})
  }

  return (
    <nav id="navbar">
      <NavLink
        to={{pathname: "/home"}}
        className="nav-link button"
        >Home
      </NavLink>
      <NavLink
        to={{pathname: "/profile"}}
        className="nav-link button"
        >Profile
      </NavLink>
      <NavLink className="nav-link button" onClick={handleLogoutClick}>
        LOGOUT  
      </NavLink>
    </nav>
  )
}

export default NavBar