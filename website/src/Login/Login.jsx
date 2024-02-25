import "./Login.css";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { Divider, PasswordInput, TextInput } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, error, isPending, loginWithGoogle, googleError } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(email, password);
    };

    const { width: windowWidth } = useViewportSize();

    return (
        <>
            <div className="loginDiv">
                <div
                    className="LoginBox"
                    style={{
                        width: windowWidth > 850 ? "50vw" : "80vw",
                    }}
                >
                    <div className="titleContainer">
                        <h1 id="LoginText">Login</h1>
                    </div>
                    <div id="Login_Container">
                        <TextInput
                            className="Login_Input"
                            placeholder="Email"
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <PasswordInput
                            className="Login_Input"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="submitAndPassword">
                            <button className="Submit_Login_Button" onClick={handleSubmit} disabled={isPending}>
                                {!isPending ? "Login" : "Loading..."}
                            </button>
                            {error && <div className="error">{error}</div>}
                            <Link className="forgotPassword" to={"/forgot-password"}>
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                    <Divider my="md" className="divider" label="OR" labelPosition="center" />
                    <div id="Login_Button_Container">
                        <button className="Submit_Login_Button" onClick={loginWithGoogle} type="button">
                            <IconBrandGoogleFilled />
                            Log in With Google
                        </button>
                        {googleError && <div className="error">{googleError}</div>}
                    </div>
                </div>
            </div>
        </>
    );
}
