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
            desc="Easily upload your datasets in various formats and get started with your data analysis and machine learning projects."
          />
        </NavLink>

        <NavLink to="/Explore" style={{ textDecoration: "none" }}>
          <Card
            img={clean}
            title="Exploratory Data Analysis & Cleaning"
            desc="Effortlessly explore and clean your data with our intuitive interface, ensuring your datasets are ready for analysis and modeling."
          />
        </NavLink>


        <NavLink to="/FeatureEngineering" style={{ textDecoration: "none" }}>
          <Card
            img={viz}
            title="Transform Features with interactive Visualizations"
            desc="Perform feature engineering and transformation with our interactive visualization tools."
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