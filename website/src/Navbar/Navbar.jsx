import {} from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";

export default function Navbar() {
    let authContext = useAuthContext();
    let user = authContext.user;
    let authIsReady = authContext.authIsReady;
    const navigate = useNavigate();
    const handleSignUpClick = () => {
        navigate("/signup");
    };
    const handleHomeClick = () => {
        navigate("/");
    };
    const handleForumClick = () => {
        navigate("/forum");
    };
    const handleSchoolClick = () => {
        navigate("/school");
    };
    const handleLoginClick = () => {
        navigate("/login");
    };
    const handleProfileClick = () => {
        navigate(`/profile/${user.uid}`);
    };

    const { height, width } = useViewportSize();
    console.log("width is" + width);
    console.log("height is" + height);

    return (
        <>
            {width > 600 && (
                <div className="navbar">
                    <button className="home" onClick={handleHomeClick}>
                        Home
                    </button>
                    <button className="studentForum" onClick={handleForumClick}>
                        Student Forum
                    </button>
                    <button className="schoolHub" onClick={handleSchoolClick}>
                        School Hub
                    </button>
                    {user != null && authIsReady && (
                        <div className="right-buttons">
                            <button className="profileButton" onClick={handleProfileClick}>
                                Profile
                            </button>
                        </div>
                    )}
                    {user == null && authIsReady && (
                        <>
                            <div className="right-buttons">
                                <button className="signup" onClick={handleSignUpClick}>
                                    Sign Up
                                </button>
                                <button className="login" onClick={handleLoginClick}>
                                    Login
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
            {width <= 600 && (
                <div id="sidebar_parent">
                    <label className="hamburger-menu">
                        <input type="checkbox" />
                    </label>
                    <aside className="sidebar">
                        <nav>
                            <button className="home_burger" onClick={handleHomeClick}>
                                Home
                            </button>
                            <button className="studentForum_burger" onClick={handleForumClick}>
                                Student Forum
                            </button>
                            <button className="schoolHub_burger" onClick={handleSchoolClick}>
                                School Hub
                            </button>
                            {user != null && authIsReady == true ? (
                                <button className="profileButton" onClick={handleProfileClick}>
                                    Profile
                                </button>
                            ) : (
                                <>
                                    <button className="signup_burger" onClick={handleSignUpClick}>
                                        Sign Up
                                    </button>
                                    <button className="login_burger" onClick={handleLoginClick}>
                                        Login
                                    </button>
                                </>
                            )}
                        </nav>
                    </aside>
                </div>
            )}
        </>
    );
}
