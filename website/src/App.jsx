import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home/Home";
import Forum from "./Forum/Forum";
import School from "./School/School";
import Profile from "./Profile/Profile";
import Login from "./Login/Login";
import { useAuthContext } from "./hooks/useAuthContext";
import { useUserDocContext } from "./hooks/useUserDocContext";
import Navbar from "./Navbar/Navbar";
import Signup from "./Signup/Signup";
import Activity from "./Activity/Activity";
import PasswordReset from "./PasswordReset/PasswordReset";
import ProfileSettings from "./Profile/ProfileSettings";
import Signup2 from "./Signup/Signup2";
import Create from "./Forum/Create";
import PostDetail from "./Forum/PostDetail";

export default function App() {
    const { user, authIsReady } = useAuthContext();
    // const { userDoc, error } = useUserDocContext();

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/school" element={<School />} />
                {authIsReady && (
                    <Route path="/profile/settings" element={user ? <ProfileSettings /> : <Navigate to="/" />} />
                )}
                {authIsReady && <Route path="/profile/:id" element={user ? <Profile /> : <Navigate to="/" />} />}

                {authIsReady && <Route path="/activity/:id" element={user ? <Activity /> : <Navigate to={"/login"} />} />}

                {authIsReady && <Route path="/create" element={user ? <Create /> : <Navigate to={"/login"} />} />}
                {authIsReady && <Route path="/forum/:id" element={user ? <PostDetail /> : <Navigate to={"/login"} />} />}
                {authIsReady && <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />}
                {authIsReady && <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />}
                <Route path="/signup2" element={<Signup2 />} />

                <Route path="/forgot-password" element={<PasswordReset />} />
            </Routes>
        </>
    );
}
