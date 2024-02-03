import React, { useState } from "react";
import { useSignupInfo } from "../hooks/useSignupInfo";

export default function Signup2() {
    const [age, setAge] = useState(null);
    const [grade, setGrade] = useState(null);
    const [location, setLocation] = useState(null);
    const [interest, setInterest] = useState("");
    const [interests, setInterests] = useState([]);
    const [profilePicture, setProfilePicture] = useState(null);

    const { signup2, isPending, error } = useSignupInfo();

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        signup2(age, grade, location, interests, profilePicture);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Age: <input type="number" onChange={(e) => setAge(e.target.value)} />
                </label>

                <label>
                    Grade (6-12): <input type="number" onChange={(e) => setGrade(e.target.value)} />
                </label>

                <label>
                    Location: <input type="text" onChange={(e) => setLocation(e.target.value)} />
                </label>
                <br />
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
                <label>
                    Profile Picture: <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
                </label>
                <button type="submit">Submit</button>

                {isPending && (
                    <button className="btn" disabled>
                        Loading...Do Not Refresh The Page
                    </button>
                )}
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
}
