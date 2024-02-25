import { PasswordInput, Stepper, TextInput } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { useRef, useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { Interest } from "./Interest";
import "./Signup.css";
import tags from "./tagArray";
import { NextButton, PrevButton, SubmitButton } from "./Buttons";

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
    // const { signInWithGoogle, error2 } = useGoogleSignIn();

    const handleSubmit = async (e) => {
        e.preventDefault();
        signup(email, password, confirmPassword, displayName, age, grade, location, profilePicture, interests);
    };

    return (
        <>
            <div id="Whole_Container">
                <div id="Signup_Text_Container">
                    <h1 id="Signup_Text">Sign Up</h1>
                    {error && <div className="errorDiv">{error}</div>}
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

                {active === 0 && (
                    <div ref={element1Ref} className="Individual_Step" id="Individual_Step_1">
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
                        <NextButton nextStep={nextStep} />
                    </div>
                )}

                {active === 1 && (
                    <div ref={element2Ref} className="Individual_Step" id="Individual_Step_2">
                        <PrevButton prevStep={prevStep} />
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
                                Profile Picture: <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
                            </label>
                        </div>
                        <NextButton nextStep={nextStep} />
                    </div>
                )}

                {active === 2 && (
                    <div ref={element3Ref} className="Individual_Step" id="Individual_Step_3">
                        <PrevButton prevStep={prevStep} />
                        <h3 id="Interests_Box_Title">What opportunities are you interested in finding?</h3>
                        <div className="Form_Container" id="Interests_Container">
                            {/* <div className="All_Interest_Items"> */}
                            {tags.map((tag, index) => (
                                <Interest
                                    key={index}
                                    text={tag}
                                    interests={interests}
                                    setInterests={setInterests}
                                    isInInterestsPreviously={interests.includes(tag)}
                                />
                            ))}
                            {/* </div> */}
                        </div>
                        <SubmitButton handleSubmit={handleSubmit} />
                    </div>
                )}
            </div>
        </>
    );
}
