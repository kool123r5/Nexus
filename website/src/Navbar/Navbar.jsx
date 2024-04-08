import { Burger } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useUserDocContext } from "../hooks/useUserDocContext";
import { useAuthContext } from "../hooks/useAuthContext";


export default function Navbar() {
    const navigate = useNavigate();
    const userDoc = useUserDocContext();
    let { user, authIsReady } = useAuthContext();


    const handleHomeClick = () => {
        navigate("/");
    };    
    
    const handleSearchClick = () => {
        navigate("/search");
    };

    const handleSignUpClick = () => {
        navigate("/signup");
    };

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleProfileClick = () => {
        navigate(`/profile/${userDoc.username}`);
    };

    const { width } = useViewportSize();
    const [opened, { toggle }] = useDisclosure();

    return (
        <>
            {width > 600 && (
                <div className="navbar">
                    <div className="left_hand_navbar_buttons">
                        <button className="homeNav" onClick={handleHomeClick}>
                            Home
                        </button>
                        <button className="searchNav" onClick={handleSearchClick}>
                            Search
                        </button>
                    </div>
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
                                <button className="searchNav" onClick={handleSearchClick}>
                                    Search
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
                            </nav>
                        </aside>
                    )}
                </div>
            )}
        </>
    );
}
