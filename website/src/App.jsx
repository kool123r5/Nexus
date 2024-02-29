import { Navigate, Route, Routes } from "react-router-dom";
import Activity from "./Activity/Activity";
import EmailTemplate from "./EmailTemplate/EmailTemplate";
import Create from "./Forum/Create";
import Forum from "./Forum/Forum";
import PostDetail from "./Forum/PostDetail";
import Home from "./Home/Home";
import Login from "./Login/Login";
import PasswordReset from "./PasswordReset/PasswordReset";
import Profile from "./Profile/Profile";
import ProfileSettings from "./Profile/ProfileSettings";
import School from "./School/School";
import Signup from "./Signup/Signup";
import { useAuthContext } from "./hooks/useAuthContext";
import Counsellor from "./Counsellor/Counsellor";

export default function App() {
    const { user, authIsReady } = useAuthContext();

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/counsellor" element={<Counsellor />} />
                <Route path="/school" element={<School />} />
                {authIsReady && (
                    <Route
                        path="/profile/settings"
                        element={user ? <ProfileSettings /> : <Navigate replace to="/login" />}
                    />
                )}
                {authIsReady && (
                    <Route path="/profile/:id" element={user ? <Profile /> : <Navigate replace to="/login" />} />
                )}

                {authIsReady && (
                    <Route path="/activity/:id" element={user ? <Activity /> : <Navigate replace to={"/login"} />} />
                )}

                {authIsReady && <Route path="/create" element={user ? <Create /> : <Navigate replace to={"/login"} />} />}
                {authIsReady && (
                    <Route path="/forum/:id" element={user ? <PostDetail /> : <Navigate replace to={"/login"} />} />
                )}
                {authIsReady && <Route path="/login" element={user ? <Navigate replace to="/" /> : <Login />} />}
                {authIsReady && <Route path="/signup" element={user ? <Navigate replace to="/" /> : <Signup />} />}

                {authIsReady && <Route path="/auth/action" element={<EmailTemplate />} />}

                <Route path="/forgot-password" element={<PasswordReset />} />
            </Routes>
        </>
    );
}
