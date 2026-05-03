import React from 'react'
import Navlink from './Navlink'
import Logo from './Logo'
import Dsc from '../../../assets/landing-assets/dsc.png'
import './Navbar.css'


const Navlinks = [
    { label: "Home", path: "/" },
    { label: "Explore", path: "/Explore" },
    { label: "Upload Dataset", path: "/Upload" },
    { label: "Documentation", path: "/Documentation" },
    {label : 'Workflow',path:'/Workkflow'}
]
const Authlinks = [
    { label: 'Login', path: '/Login' },
    { label: 'Signup', path: '/Signup' }

]


function NavBar() {
    return (
        <div className="navbar-container">

            {/* Left: Logo */}
            <div className="nav-left">
                <Logo src={Dsc} alt="DSC Logo" />

                 <div className="nav-head">
                    <h2>AI NeuroX</h2>
                </div>
            </div>

            {/* Center: Nav Links */}
            <div className="nav-center">
                <Navlink links={Navlinks} />
            </div>

            {/* Right: Auth Links */}
            <div className="nav-right">
                <Navlink links={Authlinks} />
            </div>

        </div>
    )
}

export default NavBar