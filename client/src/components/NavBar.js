import React from "react";
import { NavLink } from "react-router-dom";

function NavBar({ user, setUser }) {

  function handleLogoutClick() {
    fetch("/logout", { method: "DELETE" })
      .then((r) => { if (r.ok) { setUser(null) }})
  }

  return (
    <nav id="navbar">
      <NavLink to="/home" className="nav-link nav-button">Home</NavLink>
      <NavLink to="/new_ticket" className="nav-link nav-button">New Ticket</NavLink>
      {user.role == 'admin' && <NavLink to="/admin" className="nav-link nav-button">Admin</NavLink>}
      <NavLink to="/profile" className="nav-link nav-button">Profile</NavLink>
      {user && <div className="username-nav in-line">{user.username}</div>}
      <NavLink className="nav-link nav-button" onClick={handleLogoutClick}>Logout</NavLink>
    </nav>
  )
}

export default NavBar