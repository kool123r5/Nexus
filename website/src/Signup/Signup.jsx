import Navbar from "../Navbar/Navbar";
import "./Signup.css";
import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import useGoogleSignIn from "../hooks/useGoogleSignIn";
import { Stepper, Button, Group, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [displayName, setName] = useState("");
    const [age, setAge] = useState(null);
    const [grade, setGrade] = useState(null);
    const [location, setLocation] = useState(null);
    const [interests, setInterests] = useState([]);
    const [profilePicture, setProfilePicture] = useState(null);
    const [active, setActive] = useState(1);
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const { signup, isPending, error } = useSignup();
    const { signInWithGoogle, error2 } = useGoogleSignIn();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password == confirmPassword && password.length >= 6 && hasNumber(password) && email != "" && displayName != "") {
            signup(email, password, confirmPassword, displayName);
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
            <MantineProvider>
                <div id="Whole_Container">
                    <div id="Signup_Text_Container">
                        <h1 id="Signup_Text">Sign Up</h1>
                    </div>
                    <div id="Stepper_Container">
                        <Stepper
                            color="#FF6D00"
                            active={active}
                            size="md"
                            onStepClick={setActive}
                            id="SignUp_Stepper"
                            allowNextStepsSelect={false}
                        >
                            <Stepper.Step label="First Step" description="Create an Account" />
                            <Stepper.Step label="Second step" description="Verify email" />
                            <Stepper.Step label="Final step" description="Get full access" />
                        </Stepper>
                    </div>
                    <div id="Steps_Container">
                        <div className="Individual_Step" id="Individual_Step_1">
                            <form onSubmit={handleSubmit}>
                                <div className="Form_Container">
                                    <input
                                        className="Signup_Input"
                                        placeholder="Full Name"
                                        type="text"
                                        onChange={(e) => setName(e.target.value)}
                                    ></input>

                                    <input
                                        className="Signup_Input"
                                        placeholder="Email"
                                        type="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                    ></input>

                                    <input
                                        className="Signup_Input"
                                        placeholder="Password"
                                        type="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                    ></input>
                                    {password && password.length < 6 ? <p>Password must be at least 6 characters</p> : <></>}
                                    {password && !hasNumber(password) ? <p>Password must have a digit</p> : <></>}

                                    <input
                                        className="Signup_Input"
                                        placeholder="Confirm Password"
                                        type="password"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    ></input>
                                    {confirmPassword != password ? <p>Passwords do not match.</p> : <p></p>}
                                    <br />

                                    <br />
                                    <br />
                                </div>
                            </form>
                            <br />
                            <button type="submit" onClick={nextStep}>
                                Next
                            </button>
                        </div>

                        <div className="Individual_Step" id="Individual_Step_2">
                            XYZ
                        </div>

                        <div className="Individual_Step" id="Individual_Step_3">
                            ABC
                        </div>
                    </div>
                </div>
            </MantineProvider>
        </>
    );
}

/*                    {isPending && (
                        <button className="btn" disabled>
                            Loading...Do Not Refresh The Page
                        </button>
                    )}
                    {error && <div className="error">{error}</div>}
                    <button onClick={handleGoogleSignIn}>Sign up with Google</button>
                    {error2 && <div className="error">{error2}</div>}

*/
