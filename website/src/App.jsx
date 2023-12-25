import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./Home/Home";
import Forum from "./Forum/Forum";
import School from "./School/School";
import Profile from "./Profile/Profile";
import Login from "./Login/Login";
import { useAuthContext } from "./hooks/useAuthContext";
import Navbar from "./Navbar/Navbar";
import Signup from "./Signup/Signup";

function App() {
  const { user,authIsReady } = useAuthContext();

  return (
    <>
    
      <Router>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/school" element={<School />} />
          {authIsReady && <Route path="/profile/:id" element={user ? <Profile></Profile>  :  <Navigate to="/" /> } />}
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" /> : <Signup />}
          />
          
         
        </Routes>
      </Router>
    </>
  );
}

export default App;
