import "./App.css";
import Home from "./Home/Home";
import Forum from "./Forum/Forum";
import School from "./School/School";
import Profile from "./Profile/Profile";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/school" element={<School />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
