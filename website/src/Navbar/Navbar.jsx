import { Burger } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import "./Navbar.css";

export default function Navbar() {
    let { user, authIsReady } = useAuthContext();

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

    const { width } = useViewportSize();
    const [opened, { toggle }] = useDisclosure();

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
            {width <= 600 && width != 0 && (
                <div id="sidebar_parent">
                    <Burger id="burger" size="xl" opened={opened} onClick={toggle} aria-label="Toggle navigation" />
                    {opened && (
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
                                {user != null && authIsReady && (
                                    <button className="profileButton" onClick={handleProfileClick}>
                                        Profile
                                    </button>
                                )}
                                {user == null && authIsReady && (
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
                    )}
                </div>
            )}
        </>
    );
}
