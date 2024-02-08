import "./Signup.css";
import { useState } from "react";
import { useRef } from "react";
import { useSignup } from "../hooks/useSignup";
import useGoogleSignIn from "../hooks/useGoogleSignIn";
import { Stepper, PasswordInput, TextInput } from "@mantine/core";
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconCheck } from "@tabler/icons-react";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { Interest } from "./Interest";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [displayName, setName] = useState("");
    const [age, setAge] = useState("");
    const [grade, setGrade] = useState("");
    const [location, setLocation] = useState("");
    const [interests, setInterests] = useState([]);
    const [profilePicture, setProfilePicture] = useState(null);
    const [active, setActive] = useState(0);

    const [visible, { toggle }] = useDisclosure(false);
    const { width } = useViewportSize();

    const element1Ref = useRef(null);
    const element2Ref = useRef(null);
    const element3Ref = useRef(null);
    const stepsRef = useRef(null);

    const nextStep = () => {
        setActive((current) => {
            const newActive = Math.min(current + 1, 2);
            const scrollAmount = newActive * window.innerWidth;

            // if (stepsRef.current) {
            //     stepsRef.current.scrollTo({
            //         left: scrollAmount,
            //         behavior: "smooth",
            //     });
            // }

            return newActive;
        });
    };

    const prevStep = () => {
        setActive((current) => {
            const newActive = Math.max(current - 1, 0);
            const scrollAmount = newActive * window.innerWidth;

            // if (stepsRef.current) {
            //     stepsRef.current.scrollTo({
            //         left: scrollAmount,
            //         behavior: "smooth",
            //     });
            // }

            return newActive;
        });
    };

    const { signup, isPending, error } = useSignup();
    const { signInWithGoogle, error2 } = useGoogleSignIn();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            password == confirmPassword &&
            password.length >= 6 &&
            hasNumber(password) &&
            email != "" &&
            displayName != "" &&
            interests != []
        ) {
            signup(email, password, confirmPassword, displayName, age, grade, location, profilePicture, interests);
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
            <div id="Whole_Container">
                <div id="Signup_Text_Container">
                    <h1 id="Signup_Text">Sign Up</h1>
                </div>
                {width > 750 && (
                    <div id="Stepper_Container">
                        <Stepper
                            color="#FF6D00"
                            active={active}
                            size="lg"
                            onStepClick={setActive}
                            id="SignUp_Stepper"
                            allowNextStepsSelect={false}
                        >
                            <Stepper.Step label="First Step" description="Create an Account" />
                            <Stepper.Step label="Second step" description="Basic Information" />
                            <Stepper.Step label="Final step" description="Interests" />
                        </Stepper>
                    </div>
                )}

                <div id="Steps_Container" ref={stepsRef}>
                    {active === 0 && (
                        <div ref={element1Ref} className="Individual_Step" id="Individual_Step_1">
                            <form className="Center_Signup_Items" onSubmit={handleSubmit}>
                                <div className="Form_Container">
                                    <TextInput
                                        className="Signup_Input"
                                        placeholder="Full Name"
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setName(e.target.value)}
                                    ></TextInput>

                                    <TextInput
                                        className="Signup_Input"
                                        placeholder="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    ></TextInput>

                                    <PasswordInput
                                        className="Signup_Input"
                                        placeholder="Password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        visible={visible}
                                        onVisibilityChange={toggle}
                                    ></PasswordInput>

                                    <PasswordInput
                                        className="Signup_Input"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        visible={visible}
                                        onVisibilityChange={toggle}
                                    ></PasswordInput>
                                </div>
                            </form>

                            <br />
                        </div>
                    )}

                    {active === 1 && (
                        <div ref={element2Ref} className="Individual_Step" id="Individual_Step_2">
                            <form className="Center_Signup_Items" onSubmit={handleSubmit}>
                                <div className="Form_Container">
                                    <TextInput
                                        placeholder="Age"
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />

                                    <TextInput
                                        placeholder="Grade (6 - 12)"
                                        type="number"
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                    />

                                    <TextInput
                                        placeholder="Location"
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />

                                    <br />

                                    <label>
                                        Profile Picture:{" "}
                                        <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
                                    </label>
                                </div>
                            </form>
                        </div>
                    )}

                    {active === 2 && (
                        <div ref={element3Ref} className="Individual_Step" id="Individual_Step_3">
                            <h2 id="Interests_Box_Title">Interests</h2>
                            <div className="Form_Container" id="Interests_Container">
                                <form className="Center_Signup_Items">
                                    <div className="All_Interest_Items">
                                        <Interest
                                            text={"Chess"}
                                            interests={interests}
                                            setInterests={setInterests}
                                            isInInterestsPreviously={interests.includes("Chess")}
                                        />
                                        <Interest
                                            text={"Tennis"}
                                            interests={interests}
                                            setInterests={setInterests}
                                            isInInterestsPreviously={interests.includes("Tennis")}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                <div className="sign_up_button_container">
                    {(active === 0 || active === 1) && (
                        <div className="sign_up_next_button_container">
                            <button type="submit" onClick={nextStep} className="sign_up_next_button">
                                <div
                                    style={{
                                        display: "flex",
                                    }}
                                >
                                    <IconArrowNarrowRight size={35} />
                                </div>
                            </button>
                        </div>
                    )}

                    {(active === 1 || active === 2) && (
                        <div className="sign_up_prev_button_container">
                            <button type="submit" onClick={prevStep} className="sign_up_prev_button">
                                <div
                                    style={{
                                        display: "flex",
                                    }}
                                >
                                    <IconArrowNarrowLeft size={35} />
                                </div>
                            </button>
                        </div>
                    )}

                    {active === 2 && (
                        <div className="sign_up_submit_button_container">
                            <button type="submit" className="sign_up_submit_button" onClick={handleSubmit}>
                                <div
                                    style={{
                                        display: "flex",
                                    }}
                                >
                                    <IconCheck size={35} />
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
