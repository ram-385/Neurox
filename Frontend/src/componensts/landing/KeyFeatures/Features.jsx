import React from 'react'
import Card from './Card'
import './Features.css'
import { NavLink } from 'react-router-dom'
import uploadImg from '../../../assets/landing-assets/upload.jpg'
import clean from '../../../assets/landing-assets/clean.png'
import viz from '../../../assets/landing-assets/viz.png'
import train from '../../../assets/landing-assets/train.png'

function Features() {
  return (
    <div>
      <h2 className="features-title"><span>Key Features</span></h2>
      <div className="features-container">

        <NavLink to="/Upload" style={{ textDecoration: "none" }}>
          <Card
            img={uploadImg}
            title="Upload Data"
            desc="Easily upload your datasets in seconds and kickstart your machine learning workflow"
          />
        </NavLink>

        <NavLink to="/Clean" style={{ textDecoration: "none" }}>
          <Card
            img={clean}
            title="Automatic Data Cleaning"
            desc="Automatically handle missing values, outliers, and inconsistencies with smart data cleaning tools."
          />
        </NavLink>


        <NavLink to="/Viz" style={{ textDecoration: "none" }}>
          <Card
            img={viz}
            title="Interactive visualizations"
            desc="Transform your data into interactive charts and gain meaningful insights instantly."
          />
        </NavLink>


        <NavLink to="/Model" style={{ textDecoration: "none" }}>
          <Card
            img={train}
            title="Model Training"
            desc="Train your machine learning models with ease using our intuitive interface and powerful algorithms."
          />
        </NavLink>

      </div>
    </div>
  )
}

export default Features