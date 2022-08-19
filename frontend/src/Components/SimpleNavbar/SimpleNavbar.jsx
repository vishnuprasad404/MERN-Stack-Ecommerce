import React from 'react'
import './SimpleNavbar.css'
import { Link } from "react-router-dom";


function SimpleNavbar() {
  return (
    <nav className="simple-navbar">
    <h4>Ecart</h4>
    <ul className="simple-nav-links">
      <li>
        <Link className="link" to="/signin">
          SignIn
        </Link>
      </li>
      <li>
        <Link className="link" to="/signup">
          Create an account
        </Link>
      </li>
    </ul>
  </nav>
  )
}

export default SimpleNavbar