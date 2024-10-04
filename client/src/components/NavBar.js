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
        to={{pathname: "/Home"}}
        className="nav-link"
        >Home
      </NavLink>
      <NavLink className="nav-link" onClick={handleLogoutClick}>
        LOGOUT  
      </NavLink>
    </nav>
  )
}

export default NavBar