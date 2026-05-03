import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../componensts/landing/Navbar/NavBar.jsx";
import Footer from "../componensts/landing/Footer/Footer.jsx";

function Layout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default Layout;