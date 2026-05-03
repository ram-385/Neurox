import React from 'react'
import { NavLink as RouterNavLink } from 'react-router-dom'
import './Navlink.css'

function Navlink({ links = [], variant = "default" }) {
  return (
    <ul className="nav-card">
      {links.map((link) => (
        <li className="nav-item" key={link.path}>
          <RouterNavLink
            to={link.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {link.label}
          </RouterNavLink>
        </li>
      ))}
    </ul>
  )
}

export default Navlink