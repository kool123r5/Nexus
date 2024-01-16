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
    const [interests, setInterests] = useState([]);
    const [profilePicture, setProfilePicture] = useState(null);

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
                <button onClick={handleGoogleSignIn}>Sign up with Google</button>
                {error2 && <div className="error">{error2}</div>}
            </div>
        </>
    );
}




/* Use Later 

import { useState } from 'react';
import { Stepper, Button, Group } from '@mantine/core';

function Demo() {
  const [active, setActive] = useState(1);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="First step" description="Create an account">
          Step 1 content: Create an account
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Verify email">
          Step 2 content: Verify email
        </Stepper.Step>
        <Stepper.Step label="Final step" description="Get full access">
          Step 3 content: Get full access
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Next step</Button>
      </Group>
    </>
  );
}

*/
