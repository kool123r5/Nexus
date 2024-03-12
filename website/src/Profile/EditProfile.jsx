import "./EditProfile.css";
import Navbar from "../Navbar/Navbar";
import { useUserDocContext } from "../hooks/useUserDocContext";
import "./Profile.css";
import { NumberInput, TextInput, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";

export default function EditProfile() {
    const { userDoc, error } = useUserDocContext();
    const [disabled, setDisabled] = useState(true);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [age, setAge] = useState("");
    const [grade, setGrade] = useState("");
    const [location, setLocation] = useState("");

    const handleSave = () => {
        projectFirestore.collection("users").doc(projectAuth.currentUser.uid).update({
            displayName: name,
            bio: bio,
            age: age,
            grade: grade,
            location: location,
        });
    };

    useEffect(() => {
        if (userDoc) {
            if (
                (name != userDoc.displayName && name != "") ||
                (bio != userDoc.bio && bio != "") ||
                (age != userDoc.age && age != "") ||
                (grade != userDoc.grade && grade != "") ||
                (location != userDoc.location && location != "")
            ) {
                setDisabled(false);
            } else {
                setDisabled(true);
            }
        }
    }, [name, bio, age, grade, location, userDoc]);

    if (error) {
        return <div className="errorDiv">Sorry, there was an error fetching this user!</div>;
    }

    return (
        <>
            <Navbar />
            {userDoc && (
                <div className="editProfile">
                    <div className="editProfileForm">
                        <TextInput
                            className="editProfileInput"
                            placeholder={userDoc.displayName}
                            size={"lg"}
                            description={"Name"}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Textarea
                            className="editProfileInput"
                            placeholder={userDoc.bio || "New Bio"}
                            size={"lg"}
                            description={"Bio"}
                            autosize
                            onChange={(e) => setBio(e.target.value)}
                        />
                        <NumberInput
                            className="editProfileInput"
                            placeholder={`${userDoc.age}`}
                            description={"Age"}
                            size={"lg"}
                            onChange={(e) => setAge(e)}
                            min={10}
                            max={80}
                            allowDecimal={false}
                        />
                        <NumberInput
                            className="editProfileInput"
                            placeholder={`${userDoc.grade}`}
                            description={"Grade"}
                            size={"lg"}
                            onChange={(e) => setGrade(e)}
                            min={3}
                            max={12}
                            allowDecimal={false}
                        />
                        <TextInput
                            className="editProfileInput"
                            placeholder={userDoc.location}
                            size={"lg"}
                            description={"Location"}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <button
                            disabled={disabled}
                            style={{
                                cursor: disabled ? "not-allowed" : "pointer",
                                backgroundColor: disabled ? "#1a1a1a" : "#ff6d00",
                            }}
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
