import { PasswordInput, Stepper, TextInput } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { Interest } from "./Interest";
import "./Signup.css";
import tags from "./tagArray";
import { NextButton, PrevButton, SubmitButton } from "./Buttons";
import hasNumber from "../functions/hasNumber";
import validator from "email-validator";
import { Toaster, toast } from "sonner";
import { projectFirestore } from "../firebase/config";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [displayName, setName] = useState("");
    const [username, setUsername] = useState("");
    const [bio,setBio]=useState("")
    const [age, setAge] = useState("");
    const [grade, setGrade] = useState("");
    const [location, setLocation] = useState("");
    const [interests, setInterests] = useState([]);
    const [active, setActive] = useState(0);
    const [errorFirstSection, setErrorFirstSection] = useState("");
    const [errorSecondSection, setErrorSecondSection] = useState("");
    const [errorThirdSection, setErrorThirdSection] = useState("");

    const [visible, { toggle }] = useDisclosure(false);
    const { width } = useViewportSize();

    const element1Ref = useRef(null);
    const element2Ref = useRef(null);
    const element3Ref = useRef(null);

    const nextStep = () => {

        const newActive = Math.min(active + 1, 2);
        if (active == 0) {
            if (errorFirstSection != "" || displayName == "" || password == "" || email == "" || confirmPassword == "") {
                setActive(active);
                return;
            } else if (username == "") {
                setErrorFirstSection("Please enter a Username");
                setActive(active);
                return;
            }else{
                setActive(newActive)
                return
            }
        }

        if (active == 1) {
            if (errorSecondSection != "" || age == "" || grade == "" || location == "") {
                setActive(active);
                return;
            } else {
                setActive(newActive);
                return;
            }
        }
    };

    useEffect(() => {
        if (active == 0) {
            if (displayName.split(" ").length < 2 && displayName != "") {
                setErrorFirstSection("Please enter your full name");
            } else if (email != "" && !validator.validate(email)) {
                setErrorFirstSection("Please enter a valid email");
            } else if (password != "" && (password.length < 6 || !hasNumber(password))) {
                setErrorFirstSection("Your password must have atleast 6 characters, including a number");
            } else if (password != confirmPassword) {
                setErrorFirstSection("Passwords don't match!");
            } else {
                setErrorFirstSection("");
            }
        }
    }, [displayName, password, confirmPassword, email, active, username]);

    useEffect(() => {
        if (active == 1) {
            if (age == "") {
                setErrorSecondSection("Please enter");
            } else if (grade == "") {
                setErrorSecondSection("Please enter");
            } else if (location == "") {
                setErrorSecondSection("Please enter");
            } else {
                setErrorSecondSection("");
            }
        }
    }, [age, grade, location, active]);

    const prevStep = () => {
        setActive((current) => {
            const newActive = Math.max(current - 1, 0);

            return newActive;
        });
    };

    const { signup, error } = useSignup();
    // const { signInWithGoogle, error2 } = useGoogleSignIn();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(interests)
        if (interests.length == 0) {
            setErrorThirdSection("Please select at least 1 interest");
            return;
        }
        const signUpPromise = signup(
            email,
            password,
            confirmPassword,
            displayName,
            age,
            grade,
            location,
            bio,
            interests,
            username
        );
        toast.promise(signUpPromise, {
            loading: "Signing you up. We'll reroute you when it's done",
            success: () => {
                return "Successfully made an account";
            },
            error: "Something went wrong",
        });
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
                                error={
                                    errorFirstSection.includes("name") && !errorFirstSection.includes("Username")
                                        ? errorFirstSection
                                        : null
                                }
                                required
                            ></TextInput>

                            <TextInput
                                className="Signup_Input"
                                placeholder="Username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                error={errorFirstSection.includes("Username") ? errorFirstSection : null}
                                required
                            ></TextInput>

                            <TextInput
                                className="Signup_Input"
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={errorFirstSection.includes("email") ? errorFirstSection : null}
                                required
                            ></TextInput>

                            <PasswordInput
                                className="Signup_Input"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                error={errorFirstSection.includes("password") ? errorFirstSection : null}
                                value={password}
                                visible={visible}
                                onVisibilityChange={toggle}
                                required
                            ></PasswordInput>

                            <PasswordInput
                                className="Signup_Input"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={errorFirstSection.includes("match") ? errorFirstSection : null}
                                visible={visible}
                                onVisibilityChange={toggle}
                                required
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
                                onChange={(e) => setAge(parseInt(e.target.value))}
                            />

                            <TextInput
                                placeholder="Grade (6 - 12)"
                                type="number"
                                value={grade}
                                onChange={(e) => setGrade(parseInt(e.target.value))}
                            />

                            <TextInput
                                placeholder="Location"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />

                            <br />
                        </div>
                        <NextButton nextStep={nextStep} />
                    </div>
                )}

                {active === 2 && (
                    <div ref={element3Ref} className="Individual_Step" id="Individual_Step_3">
                        <PrevButton prevStep={prevStep} />
                        <h3 id="Interests_Box_Title">What opportunities are you interested in finding?</h3>
                        <div className="Form_Container" id="Interests_Container">
                            {tags.map((tag, index) => (
                                <Interest
                                    key={index}
                                    text={tag}
                                    interests={interests}
                                    setInterests={setInterests}
                                    isInInterestsPreviously={interests.includes(tag)}
                                />
                            ))}
                        </div>
                        <h3 className="errorTextInterest">{errorThirdSection}</h3>
                        <SubmitButton handleSubmit={handleSubmit} />
                    </div>
                )}
                <Toaster />
            </div>
        </>
    );
}
