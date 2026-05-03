import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./componensts/auth/authPages/Login";
import Signup from "./componensts/auth/authPages/Signup";
import Upload from "./pages/upload/Upload.jsx";

import Layout from "./layout/layout.jsx";
import Explore from "./pages/explore/Explore.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Upload" element={<Upload />} />
         <Route path='/Explore' element={<Explore/>}/>
      </Route>
    </Routes>
  );
}

export default App;

