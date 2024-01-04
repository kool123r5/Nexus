import Navbar from "../Navbar/Navbar";
import "./Login.css";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(null);
    const { login, error, isPending, loginWithGoogle } = useLogin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(email, password);
    };

    const handleForgotPwClick = () => {
        navigate("/forgot-password");
    };

    return (
        <>
            <Navbar />
            <div className="test">
                Login
                <form onSubmit={handleSubmit}>
                    <label>
                        Email: <input type="email" onChange={(e) => setEmail(e.target.value)}></input>
                    </label>

                    <label>
                        Password: <input type="password" onChange={(e) => setPassword(e.target.value)}></input>
                    </label>

                    <button type="submit">Submit</button>

                    <br />

                    <button onClick={handleForgotPwClick}>Forgot password?</button>

                    {isPending && !error && (
                        <button className="btn" disabled>
                            Loading...Do Not Refresh The Page
                        </button>
                    )}
                    {error && <div className="error">{error}</div>}
                    <button onClick={loginWithGoogle}>Login with Google</button>

                    {isPending && <p>Loading...</p>}
                </form>
            </div>
        </>
    );
}
