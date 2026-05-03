import React from "react";
import "./Footer.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faInstagram, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";

function Footer() {
    return (
        <footer className="footer">

            <div className="footer-container">

                {/* LEFT */}
                <div className="footer-left">
                    <h2>AI NeuroX</h2>
                    <p>Build, train and visualize ML pipelines effortlessly.</p>
                </div>

                {/* CENTER LINKS */}
                <div className="flinks">
                    <div className="footer-links">
                     <h4>Quick Links</h4>
                        <a href="#">Home</a>
                        <a href="#">Features</a>
                        <a href="#">Workflow</a>
                        <a href="#">Contact</a>
                    </div >
                    <div className="footer-links">
                        <h4>Resources</h4>
                        <a href="#">Documentation</a>
                        <a href="#">API Reference</a>
                        <a href="#">Support</a>
                        
                    </div>
                </div>

                {/* RIGHT SOCIAL */}
               <div className="social-container">


                   <h4>Follow Us</h4>
                <div className="footer-social">
                   
                   <a href="https://github.com/ram-385"> <FontAwesomeIcon icon={faGithub} /></a>
                   <a href="https://www.linkedin.com/in/ram-gautam-38046b291/?skipRedirect=true"> <FontAwesomeIcon icon={faLinkedin} /></a>
                   <a href="#"> <FontAwesomeIcon icon={faTwitter} /></a>
                   <a href="https://www.instagram.com/rk_gautam24.23/"> <FontAwesomeIcon icon={faInstagram}/> </a>
                </div>
              </div>


            </div>

            {/* BOTTOM */}
            <div className="footer-bottom">
                © 2026 AI NeuroX. All rights reserved.
            </div>

        </footer>
    );
}

export default Footer;