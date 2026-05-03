import React from 'react'
import NavBar from '../componensts/landing/navbar/NavBar.jsx'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Hero from '../componensts/landing/hero/Hero.jsx'
import Features from '../componensts/landing/KeyFeatures/Features.jsx'
import Workflow from '../componensts/landing/workflow/Workflow.jsx'
import Preview from '../componensts/landing/showcase/Preview.jsx'
import CTA from '../componensts/landing/cta/CTA.jsx'
import Footer from '../componensts/landing/Footer/Footer.jsx'


function LandingPage() {

  return (
    <div>
    
     <Hero/>
     <Features/>
     <Workflow/>
     <Preview/>
     <CTA/>

   </div>
  )
}

export default LandingPage