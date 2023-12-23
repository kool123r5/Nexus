import "./App.css";
import Home from "./Home";
import Forum from "./Forum";
import School from "./School";
import Profile from "./Profile";
import Login from "./Login";
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
                </Routes>
            </Router>
        </>
    );
}

export default App;
