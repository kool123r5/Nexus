import { Burger } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate("/");
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
                            </nav>
                        </aside>
                    )}
                </div>
            )}
        </>
    );
}
