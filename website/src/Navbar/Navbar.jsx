import { Burger } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useUserDocContext } from "../hooks/useUserDocContext";

export default function Navbar() {
    const navigate = useNavigate();
    const userDoc = useUserDocContext();

    const handleHomeClick = () => {
        navigate("/");
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
                    <button className="homeNav" onClick={handleHomeClick}>
                        Home
                    </button>
                    <button className="profileNav" onClick={handleProfileClick}>
                        Profile
                    </button>
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
                                <button className="home_burger" onClick={handleProfileClick}>
                                    Profile
                                </button>
                            </nav>
                        </aside>
                    )}
                </div>
            )}
        </>
    );
}
