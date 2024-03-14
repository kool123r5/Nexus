import "./EditProfile.css";
import Navbar from "../Navbar/Navbar";
import { useUserDocContext } from "../hooks/useUserDocContext";
import "./Profile.css";
import { MultiSelect, NumberInput, TextInput, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { Toaster, toast } from "sonner";
import { Interest } from "../Signup/Interest.jsx";
import { IconSearch } from "@tabler/icons-react";
import tags from "../Signup/tagArray.js";
import arraysEqual from "../functions/arrayEqual.js";

export default function EditProfile() {
    const { userDoc, error } = useUserDocContext();
    const [disabled, setDisabled] = useState(true);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [age, setAge] = useState("");
    const [grade, setGrade] = useState("");
    const [location, setLocation] = useState("");
    const [interests, setInterests] = useState([]);
    const [multiSelectValues, setMultiSelectValues] = useState([]);

    const handleSave = () => {
        const updateProfilePromise = projectFirestore
            .collection("users")
            .doc(projectAuth.currentUser.uid)
            .update({
                displayName: name == "" ? userDoc.displayName : name,
                bio: bio == "" ? userDoc.bio : bio,
                age: age == "" ? userDoc.age : age,
                grade: grade == "" ? userDoc.grade : grade,
                location: location == "" ? userDoc.location : location,
                interests: interests,
            });
        toast.promise(updateProfilePromise, {
            loading: "Updating profile...",
            success: () => {
                return "Profile updated";
            },
            error: "Something went wrong",
        });
    };

    useEffect(() => {
        if (userDoc) {
            if (
                (name != userDoc.displayName && name != "") ||
                (bio != userDoc.bio && bio != "") ||
                (age != userDoc.age && age != "") ||
                (grade != userDoc.grade && grade != "") ||
                (location != userDoc.location && location != "") ||
                !arraysEqual(userDoc.interests, interests)
            ) {
                setDisabled(false);
            } else {
                setDisabled(true);
            }
        }
    }, [name, bio, age, grade, location, userDoc, interests]);

    useEffect(() => {
        if (userDoc && userDoc.interests) {
            setInterests([...userDoc.interests]);
        }
    }, [userDoc]);

    // useEffect(() => {
    //     console.log("Interests are: ", interests);
    //     setTagsWithoutUserInterest((n) =>
    //         n.filter((tag) => {
    //             return !interests.includes(tag);
    //         })
    //     );
    // }, [interests]);

    // console.log("Tags are: ", tagsWithoutUserInterest);

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
                            placeholder={userDoc.displayName || "New Name"}
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
                            placeholder={`${userDoc.age}` || "New Age"}
                            description={"Age"}
                            size={"lg"}
                            onChange={(e) => setAge(e)}
                            min={10}
                            max={80}
                            allowDecimal={false}
                        />
                        <NumberInput
                            className="editProfileInput"
                            placeholder={`${userDoc.grade}` || "New Grade"}
                            description={"Grade"}
                            size={"lg"}
                            onChange={(e) => setGrade(e)}
                            min={3}
                            max={12}
                            allowDecimal={false}
                        />
                        <TextInput
                            className="editProfileInput"
                            placeholder={userDoc.location || "New Location"}
                            size={"lg"}
                            description={"Location"}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <MultiSelect
                            className="editProfileInput"
                            placeholder="Search for Interests"
                            rightSection={<IconSearch />}
                            // data={tagsWithoutUserInterest}
                            data={tags.filter((tag) => !interests.includes(tag))}
                            searchable
                            nothingFoundMessage={"Not found"}
                            onChange={(e) => {
                                // setTagsWithoutUserInterest((curr) => splitOgArray(curr, e[e.length - 1]));
                                setInterests((currentInterests) => [...currentInterests, ...e]);
                                setMultiSelectValues([]);
                            }}
                            value={multiSelectValues}
                            size={"lg"}
                        />
                        <div className="editProfileInput" id="interestsContainerEditProfile">
                            {interests.map((interest, index) => {
                                return (
                                    <Interest
                                        key={index}
                                        text={interest}
                                        interests={interests}
                                        setInterests={setInterests}
                                        isInInterestsPreviously={interests.includes(interest)}
                                    />
                                );
                            })}
                        </div>
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
                    <Toaster />
                </div>
            )}
        </>
    );
}
