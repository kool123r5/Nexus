import Navbar from "../Navbar/Navbar";
import "./Signup.css";
import { useState } from "react";
import { useRef } from "react";
import { useSignup } from "../hooks/useSignup";
import useGoogleSignIn from "../hooks/useGoogleSignIn";
import { Stepper, Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useSignupInfo } from "../hooks/useSignupInfo";



export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [displayName, setName] = useState("");
    const [age, setAge] = useState(null);
    const [grade, setGrade] = useState(null);
    const [location, setLocation] = useState(null);
    const [interest, setInterest] = useState("");
    const [interests, setInterests] = useState([]);
    const [profilePicture, setProfilePicture] = useState(null);
    const [active, setActive] = useState(0);
    const [value, setValue] = useState('');


    const element1Ref = useRef(null);
    const element2Ref = useRef(null);
    const element3Ref = useRef(null);
    const stepsRef = useRef(null)


    const nextStep = () => {
        setActive((current) => {
            const newActive = Math.min(current + 1, 2);
            const scrollAmount = newActive * window.innerWidth;
    
            if (stepsRef.current) {
                stepsRef.current.scrollTo({
                    left: scrollAmount,
                    behavior: "smooth",
                });
            }
    
            return newActive;
        });
    };
    
    const prevStep = () => {
        setActive((current) => {
            const newActive = Math.max(current - 1, 0);
            const scrollAmount = newActive * window.innerWidth;
    
            if (stepsRef.current) {
                stepsRef.current.scrollTo({
                    left: scrollAmount,
                    behavior: "smooth",
                });
            }
    
            return newActive;
        });
    };


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

    const handleInterestChange = (e) => {
        setInterest(e.target.value);
    };

    const handleInterestKeyPress = (e) => {
        if (e.key === " " && interest.trim() !== "") {
            setInterests([...interests, interest.trim()]);
            setInterest("");
        }
    };

    const removeInterest = (index) => {
        const updatedInterests = [...interests];
        updatedInterests.splice(index, 1);
        setInterests(updatedInterests);
    };


    
    

    return (
        <>
            <>
                <div id="Whole_Container">
                    <div id="Signup_Text_Container">
                        <h1 id="Signup_Text">Sign Up</h1>
                    </div>
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


                        <div id="Steps_Container" ref={stepsRef}>
                            
                            <div ref = {element1Ref} className="Individual_Step" id="Individual_Step_1">
                                <form onSubmit={handleSubmit}>
                                    <div className="Form_Container">
                                        <TextInput
                                            className="Signup_Input"
                                            placeholder="Full Name"
                                            type="text"
                                            onChange={(e) => setName(e.target.value)}
                                        ></TextInput>

                                        <TextInput
                                            className="Signup_Input"
                                            placeholder="Email"
                                            type="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                        ></TextInput>

                                        <PasswordInput
                                            className="Signup_Input"
                                            placeholder="Password"
                                            onChange={(e) => setPassword(e.target.value)}
                                        ></PasswordInput>


                                        <PasswordInput
                                            className="Signup_Input"
                                            placeholder="Confirm Password"
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        ></PasswordInput>

                                    </div>
                                </form>


                                <br />
                            </div>



                            <div ref = {element2Ref} className="Individual_Step" id="Individual_Step_2">
                                <form onSubmit={handleSubmit}>
                                    <div className="Form_Container">

                                        <TextInput 
                                        placeholder="Age"
                                        type="number" 
                                        onChange={(e) => setAge(e.target.value)} 
                                        />


                                        
                                        <TextInput 
                                        placeholder="Grade (6 - 12)"
                                        type="number" 
                                        onChange={(e) => setGrade(e.target.value)} 
                                        />
                                        

                                        
                                        <TextInput 
                                        placeholder="Location"
                                        type="text" 
                                        onChange={(e) => setLocation(e.target.value)} 
                                        />
                                        
                                        <br />

                                        <label>
                                            Profile Picture: <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
                                        </label>
 
                                    </div>
                                </form>
                            </div>



                            <div ref = {element3Ref} className="Individual_Step" id="Individual_Step_3">
                                <form onSubmit={handleSubmit}>
                                    <label>
                                        Interests:{" "}
                                        <div>
                                            {interests.map((interest, index) => (
                                                <span key={index} className="tag" onClick={() => removeInterest(index)}>
                                                    {interest} &times;
                                                </span>
                                            ))}
                                            <input
                                                type="text"
                                                value={interest}
                                                onChange={handleInterestChange}
                                                onKeyPress={handleInterestKeyPress}
                                            />
                                        </div>
                                    </label>
                                </form>
                            </div>
                        </div>





                        <div className = "sign_up_button_container">

                            {(active === 0 || active === 1) && (
                                <div className = "sign_up_next_button_container">
                                    <button type="submit" onClick={nextStep} className = "sign_up_next_button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width= "1.5em" height="1.5em" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                                    </svg>
                                    </button>
                                </div>
                            )}

                            {(active === 1 || active === 2) && (
                                <div className = "sign_up_prev_button_container">
                                    <button type="submit" onClick={prevStep} className = "sign_up_prev_button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                                    </svg>
                                    </button>
                                </div>
                            )}

                            {(active === 2) && (
                                <div className = "sign_up_submit_button_container">
                                    <button type="submit" className = "sign_up_submit_button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                                    </svg>
                                    </button>
                                </div>
                            )}



                        </div>

    

                    </div>
            </>
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

                            <button type="submit" onClick={nextStep}>
                                Next
                            </button>
                            <button type="submit" onClick={prevStep}>
                                Prev
                            </button>

                            
                    {(active === 0 || active === 1) && (
                        <button type="submit" onClick={nextStep}>
                            Next
                        </button>
                    )}

                    {(active === 1 || active === 2) && (
                        <button type="submit" onClick={prevStep}>
                            Prev
                        </button>

                                                               <button type="submit">Submit</button>

                                        {isPending && (
                                            <button className="btn" disabled>
                                                Loading...Do Not Refresh The Page
                                            </button>
                                        )}
                                        {error && <div className="error">{error}</div>}
                    )}

*/
