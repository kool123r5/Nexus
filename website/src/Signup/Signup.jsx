import Navbar from "../Navbar/Navbar";
import "./Signup.css";
import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import useGoogleSignIn from "../hooks/useGoogleSignIn";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [displayName, setName] = useState("");
    const [age, setAge] = useState(null);
    const [grade, setGrade] = useState(null);
    const [location, setLocation] = useState(null);
    const [activities, setActivities] = useState([]);
    const [friends, setFriends] = useState([]);

    const { signup, isPending, error } = useSignup();
    const { signInWithGoogle, error2 } = useGoogleSignIn();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password == confirmPassword && password.length >= 6 && hasNumber(password) && email != "" && displayName != "") {
            signup(email, password, confirmPassword, displayName, age, grade, location, activities, friends);
        }
    };

    const handleGoogleSignIn = async () => {
        signInWithGoogle();
    };

    const hasNumber = (str) => {
        return /\d/.test(str);
    };

    return (
        <>
            <Navbar />
            <div>
                Sign Up
                <form onSubmit={handleSubmit}>
                    <label>
                        Full Name: <input type="text" onChange={(e) => setName(e.target.value)}></input>
                    </label>
                    <label>
                        Email: <input type="email" onChange={(e) => setEmail(e.target.value)}></input>
                    </label>

                    <label>
                        Password: <input type="password" onChange={(e) => setPassword(e.target.value)}></input>
                    </label>
                    {password && password.length < 6 ? <p>Password must be at least 6 characters</p> : <></>}
                    {password && !hasNumber(password) ? <p>Password must have a digit</p> : <></>}

                    <label>
                        Confirm Password:{" "}
                        <input type="password" onChange={(e) => setConfirmPassword(e.target.value)}></input>
                    </label>
                    {confirmPassword != password ? <p>Passwords do not match.</p> : <p></p>}
                    <br />
                    <label>
                        Age: <input type={"number"} onChange={(e) => setAge(e.target.value)}></input>
                    </label>

                    <label>
                        Grade (6-12): <input type={"number"} onChange={(e) => setGrade(e.target.value)}></input>
                    </label>

                    <label>
                        Location: <input type={"text"} onChange={(e) => setLocation(e.target.value)}></input>
                    </label>
                    <br />
                    <label>
                        Activities: <input type={"text"} onChange={(e) => setActivities(e.target.value)}></input>
                    </label>
                    <label>
                        Friends: <input type={"text"} onChange={(e) => setFriends(e.target.value)}></input>
                    </label>
                    <br />
                    <br />
                    <button type="submit">Submit</button>

                    {isPending && (
                        <button className="btn" disabled>
                            Loading...Do Not Refresh The Page
                        </button>
                    )}
                    {error && <div className="error">{error}</div>}
                </form>
                <br />
                <button onClick={handleGoogleSignIn}>Sign in with Google</button>
                {error2 && <div className="error">{error2}</div>}
            </div>
        </>
    );
}
