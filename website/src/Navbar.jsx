import {} from "react";
import "./Navbar.css";

export default function Navbar() {
    return (
        <>
            <div className="navbar">
                <a className="home" href="/">
                    Home
                </a>
                <a className="studentForum" href="/forum">
                    Student Forum
                </a>
                <a className="schoolHub" href="/school">
                    School Hub
                </a>
                <a className="profile" href="/profile">
                    Profile
                </a>
            </div>
        </>
    );
}
