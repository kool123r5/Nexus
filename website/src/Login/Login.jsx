import Navbar from "../Navbar/Navbar";
import "./Login.css";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            <div className="LoginBox">
                <h1 id="LoginText">Login</h1>
                <div id="Login_Container">
                    <form onSubmit={handleSubmit}>
                        <div id="Login_Container2">
                            <input
                                className="Login_Input"
                                placeholder="Email"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            ></input>

                            <input
                                className="Login_Input"
                                placeholder="Password"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            ></input>
                            {!isPending && !error && (
                                <button className="Submit_Login_Button" type="submit">
                                    Submit
                                </button>
                            )}
                            {isPending && !error && (
                                <button className="Submit_Login_Button" disabled type="submit">
                                    Loading Do Not Refresh the Page
                                </button>
                            )}
                            {error && (
                                <button className="Submit_Login_Button" disabled type="submit">
                                    {error}
                                </button>
                            )}
                        </div>

                        <div id="Login_Button_Container">
                            <br />

                            {error && <div className="error">{error}</div>}
                            <button className="Submit_Login_Button" onClick={loginWithGoogle} type="button">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-google"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
                                </svg>
                                Log in With Google
                            </button>

                            <button className="Submit_Login_Button" onClick={handleForgotPwClick}>
                                Forgot password?
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
