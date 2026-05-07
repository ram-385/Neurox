import React from 'react'
import './Hero.css'
import heroImg from '../../../assets/landing-assets/Tree.webp'  
import { NavLink } from 'react-router-dom'

function Hero() {
  return (
    <section className="hero-container">

      {/* LEFT CONTENT */}
      <div className="hero-left">
        <h1 className="hero-title">
          Build Intelligent <span>Systems</span>
        </h1>

        <p className="hero-desc">
          Design and develop next-generation AI solutions with modern tools and scalable architecture.
          Transform your data into intelligent insights with powerful AI-driven automation. Build, analyze, and deploy machine learning workflows effortlessly—all in one place.
        </p>

        <div className="hero-buttons">
          <NavLink to="/Upload">
            <button className="btn-primary">Upload Dataset</button>
          </NavLink>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hero-right">
        <img src={heroImg} alt="AI Visual" />
      </div>

    </section>
  )
}

export default Hero