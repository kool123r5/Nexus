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
        </>
    );
}
