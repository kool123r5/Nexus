import { Navigate, Route, Routes } from "react-router-dom";
import Activity from "./Activity/Activity";
import EmailTemplate from "./EmailTemplate/EmailTemplate";
// import Create from "./Forum/Create";
// import Forum from "./Forum/Forum";
// import PostDetail from "./Forum/PostDetail";
import Home from "./Home/Home";
import Login from "./Login/Login";
import PasswordReset from "./PasswordReset/PasswordReset";
import Profile from "./Profile/Profile";
// import School from "./School/School";
import Signup from "./Signup/Signup";
import { useAuthContext } from "./hooks/useAuthContext";
// import Counsellor from "./Counsellor/Counsellor";
import EditProfile from "./Profile/EditProfile";
import Search from "./Search_Page/Search_Page";

export default function App() {
    const { user, authIsReady } = useAuthContext();

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/forum" element={<Forum />} />
                <Route path="/counsellor" element={<Counsellor />} />
                <Route path="/school" element={<School />} /> */}
                <Route path = "/search" element = {<Search />}/>
                {authIsReady && (
                    <Route path="/profile/:id" element={user ? <Profile /> : <Navigate replace to="/login" />} />
                )}

                <Route path="/activity/:id" element={<Activity />} />

                <Route path="/*" element={<Navigate replace to={"/"} />} />

                {/* {authIsReady && <Route path="/create" element={user ? <Create /> : <Navigate replace to={"/login"} />} />}
                {authIsReady && (
                    <Route path="/forum/:id" element={user ? <PostDetail /> : <Navigate replace to={"/login"} />} />
                )} */}
                {authIsReady && <Route path="/login" element={user ? <Navigate replace to="/" /> : <Login />} />}
                {authIsReady && <Route path="/signup" element={user ? <Navigate replace to="/" /> : <Signup />} />}

                {authIsReady && <Route path="/auth/action" element={<EmailTemplate />} />}
                {authIsReady && (
                    <Route path="/profile/edit" element={user ? <EditProfile /> : <Navigate replace to={"/login"} />} />
                )}

                <Route path="/forgot-password" element={<PasswordReset />} />
            </Routes>
        </>
    );
}
