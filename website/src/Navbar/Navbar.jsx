import {} from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import "./Navbar.css";
import { useState, useEffect } from 'react'


export default function Navbar() {
    // TO-DO: HAMBURGER MENU WHEN WIDTH < 600 PX

    
    let authContext = useAuthContext();
    let user = authContext.user;
    let authIsReady = authContext.authIsReady;

    
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
                {user != null && authIsReady == true ? (
                    <a className="profile" href="/profile">
                        Profile
                    </a>
                ) : (
                    <>
                        <a className="signup" href="/signup">
                            Sign Up
                        </a>
                        <a className="login" href="/login">
                            Login
                        </a>
                    </>
                )}
            </div>
            <label className="hamburger-menu">
                    <input type="checkbox"/>
            </label>
            <aside className = "sidebar">
                    <nav>
                        <a className="home_burger" href="/">
                            Home
                        </a>
                        <a className="studentForum_burger" href="/forum">
                            Student Forum
                        </a>
                        <a className="schoolHub_burger" href="/school">
                            School Hub
                        </a>
                        {user != null && authIsReady == true ? (
                            <a className="profile_burger" href="/profile">
                                Profile
                            </a>
                        ) : (
                            <>
                                <a className="signup_burger" href="/signup">
                                    Sign Up
                                </a>
                                <a className="login_burger" href="/login">
                                    Login
                                </a>
                            </>
                        )}
                    </nav>
                </aside>
        </>



    );
}
