import "./EditProfile.css";
import Navbar from "../Navbar/Navbar";
import { useUserDocContext } from "../hooks/useUserDocContext";
import "./Profile.css";
import { Divider, MultiSelect, NumberInput, PasswordInput, TextInput, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { Toaster, toast } from "sonner";
import { Interest } from "../Signup/Interest.jsx";
import { IconSearch } from "@tabler/icons-react";
import tags from "../Signup/tagArray.js";
import arraysEqual from "../functions/arrayEqual.js";
import firebase from "firebase/app";
import hasNumber from "../functions/hasNumber.js";
import { useDisclosure } from "@mantine/hooks";

export default function EditProfile() {
    const { userDoc, error } = useUserDocContext();
    const [disabledProfileEdit, setDisabledProfileEdit] = useState(true);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [age, setAge] = useState("");
    const [grade, setGrade] = useState("");
    const [location, setLocation] = useState("");
    const [interests, setInterests] = useState([]);
    const [multiSelectValues, setMultiSelectValues] = useState([]);
    const [newEmail, setNewEmail] = useState(null);
    const [disabledEmailChange, setDisabledEmailChange] = useState(true);
    const [errorWhileUpdatingEmail, setErrorWhileUpdatingEmail] = useState(null);
    const [needsToLogin, setNeedsToLogin] = useState(false);
    const [emailChangePassword, setEmailChangePassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [disabledPasswordChange, setDisabledPasswordChange] = useState(true);
    const [errorPasswordChange, setErrorPasswordChange] = useState(null);
    const [errorPasswordChangeCurrPw, setErrorPasswordChangeCurrPw] = useState(null);

    const [visible, { toggle }] = useDisclosure();

    const handleSave = () => {
        if(bio=="" && userDoc.bio==""){
            setBio("")
        }else{
            setBio(userDoc.bio)
        }
        const updateProfilePromise = projectFirestore
            .collection("users")
            .doc(projectAuth.currentUser.uid)
            .update({
                displayName: name == "" ? userDoc.displayName : name,
                bio: bio,
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
                setDisabledProfileEdit(false);
            } else {
                setDisabledProfileEdit(true);
            }
        }
    }, [name, bio, age, grade, location, userDoc, interests]);

    useEffect(() => {
        if (userDoc) {
            setInterests(userDoc.interests ? [...userDoc.interests] : []);
            setBio(userDoc.bio ? userDoc.bio : "");
            setName(userDoc.displayName ? userDoc.displayName : "");
            setAge(userDoc.age ? userDoc.age : "");
            setGrade(userDoc.grade ? userDoc.grade : "");
            setLocation(userDoc.location ? userDoc.location : "");
        }
    }, [userDoc]);

    const changeEmail = async () => {
        try {
            setErrorWhileUpdatingEmail(null);
            if (emailChangePassword != null && emailChangePassword != undefined && emailChangePassword != "") {
                const credential = firebase.auth.EmailAuthProvider.credential(
                    projectAuth.currentUser.email,
                    emailChangePassword
                );
                await projectAuth.currentUser.reauthenticateWithCredential(credential);
                await projectAuth.currentUser.verifyBeforeUpdateEmail(newEmail);
            } else {
                await projectAuth.currentUser.verifyBeforeUpdateEmail(newEmail);
            }
            toast("Sent your new email a verification link!");
            setEmailChangePassword("");
        } catch (err) {
            if (err.code == "auth/requires-recent-login") {
                setNeedsToLogin(true);
                toast.error("You need to enter your password to do this!");
            } else {
                if (err.message.includes("INVALID_NEW_EMAIL")) {
                    setErrorWhileUpdatingEmail("Please enter a valid email");
                } else {
                    setErrorWhileUpdatingEmail(err.message);
                }
            }
        }
    };

    const changePassword = async () => {
        try {
            if (newPassword != confirmNewPassword) {
                setErrorPasswordChange("Passwords do not match");
                return;
            }
            if (
                newPassword != "" &&
                newPassword != undefined &&
                newPassword != null &&
                currentPassword != null &&
                currentPassword != ""
            ) {
                const credential = firebase.auth.EmailAuthProvider.credential(
                    projectAuth.currentUser.email,
                    currentPassword
                );
                await projectAuth.currentUser.reauthenticateWithCredential(credential);
                await projectAuth.currentUser.updatePassword(newPassword);
                toast.success("Successfully changed your password!");
                setNewPassword("");
                setConfirmNewPassword("");
                setErrorPasswordChange("");
            }
        } catch (err) {
            if (err.message.includes("INVALID_LOGIN_CREDENTIALS")) {
                setErrorPasswordChangeCurrPw("Wrong Password");
            } else {
                setErrorPasswordChange(err.message);
            }
        }
    };

    useEffect(() => {
        if (newEmail != projectAuth.currentUser.email && newEmail != "" && newEmail != null && newEmail != undefined) {
            setDisabledEmailChange(false);
        } else {
            setDisabledEmailChange(true);
        }
    }, [newEmail]);

    useEffect(() => {
        if (newPassword == "") {
            return;
        }

        if (currentPassword == "") {
            setErrorPasswordChangeCurrPw("Enter your current password");
            return;
        }

        if (newPassword == confirmNewPassword && newPassword.length >= 6 && hasNumber(newPassword)) {
            setErrorPasswordChange("");
            setDisabledPasswordChange(false);
            return;
        }

        if (newPassword.length < 6 || !hasNumber(newPassword)) {
            setErrorPasswordChange("Your password must be atleast 6 characters and have a number.");
            setDisabledPasswordChange(true);
            return;
        }
        if (newPassword != confirmNewPassword) {
            setErrorPasswordChange("Passwords don't match!");
            setDisabledPasswordChange(true);
            return;
        }
        setDisabledPasswordChange(true);
    }, [newPassword, confirmNewPassword, currentPassword]);

    if (error) {
        return <div className="errorDiv">Sorry, there was an error fetching your profile!</div>;
    }

    return (
        <>
            <Navbar />
            {userDoc && (
                <div className="editProfile">
                    <div className="editProfileForm">
                        <h2 className="profileSettingsSubHeadings">Edit Profile</h2>
                        <TextInput
                            className="editProfileInput"
                            placeholder={userDoc.displayName || "New Name"}
                            value={name}
                            size={"lg"}
                            description={"Name"}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Textarea
                            className="editProfileInput"
                            placeholder={userDoc.bio || "New Bio"}
                            value={bio}
                            size={"lg"}
                            description={"Bio"}
                            autosize
                            onChange={(e) => setBio(e.target.value)}
                        />
                        <NumberInput
                            className="editProfileInput"
                            placeholder={`${userDoc.age}` || "New Age"}
                            description={"Age"}
                            value={age}
                            size={"lg"}
                            onChange={(e) => setAge(e)}
                            min={13}
                            max={80}
                            allowDecimal={false}
                        />
                        <NumberInput
                            className="editProfileInput"
                            placeholder={`${userDoc.grade}` || "New Grade"}
                            description={"Grade"}
                            value={grade}
                            size={"lg"}
                            onChange={(e) => setGrade(e)}
                            min={6}
                            max={12}
                            allowDecimal={false}
                        />
                        <TextInput
                            className="editProfileInput"
                            placeholder={userDoc.location || "New Location"}
                            size={"lg"}
                            value={location}
                            description={"Location"}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <MultiSelect
                            className="editProfileInput"
                            placeholder="Search for Interests"
                            rightSection={<IconSearch />}
                            data={tags.filter((tag) => !interests.includes(tag))}
                            searchable
                            nothingFoundMessage={"Not found"}
                            onChange={(e) => {
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
                            disabled={disabledProfileEdit}
                            style={{
                                cursor: disabledProfileEdit ? "not-allowed" : "pointer",
                                backgroundColor: disabledProfileEdit ? "#1a1a1a" : "#ff6d00",
                            }}
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>

                        <div className="editProfileInput">
                            <Divider color="red" />
                        </div>

                        <h2 className="editProfileDangerZoneHeading">Danger Zone</h2>
                        <h2 className="profileSettingsSubHeadings">Change Email</h2>
                        <TextInput
                            className="editProfileInput"
                            size={"xl"}
                            label="Change Email"
                            placeholder={projectAuth.currentUser && projectAuth.currentUser.email}
                            onChange={(e) => {
                                setErrorWhileUpdatingEmail(null);
                                setNewEmail(e.target.value);
                            }}
                            error={errorWhileUpdatingEmail}
                        />
                        {needsToLogin ? (
                            <PasswordInput
                                className="editProfileInput"
                                label="You need to enter your password to do this sensitive action"
                                size={"xl"}
                                onChange={(e) => setEmailChangePassword(e.target.value)}
                            />
                        ) : null}
                        <button
                            disabled={disabledEmailChange}
                            style={{
                                cursor: disabledEmailChange ? "not-allowed" : "pointer",
                                backgroundColor: disabledEmailChange ? "#1a1a1a" : "#ff6d00",
                            }}
                            onClick={changeEmail}
                        >
                            Send me a verification email
                        </button>
                        <h2 className="profileSettingsSubHeadings">Change Password</h2>
                        <PasswordInput
                            className="editProfileInput"
                            label="Current Password"
                            placeholder="******"
                            size={"xl"}
                            onChange={(e) => {
                                setErrorPasswordChangeCurrPw(null);
                                setCurrentPassword(e.target.value);
                            }}
                            error={errorPasswordChangeCurrPw}
                            required
                        />
                        <PasswordInput
                            className="editProfileInput"
                            label="New Password"
                            placeholder="******"
                            size={"xl"}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                            }}
                            error={errorPasswordChange}
                            visible={visible}
                            onVisibilityChange={toggle}
                            required
                        />
                        <PasswordInput
                            className="editProfileInput"
                            label="Confirm New Password"
                            placeholder="******"
                            size={"xl"}
                            onChange={(e) => {
                                setConfirmNewPassword(e.target.value);
                            }}
                            visible={visible}
                            onVisibilityChange={toggle}
                            required
                        />
                        <button
                            disabled={disabledPasswordChange}
                            style={{
                                cursor: disabledPasswordChange ? "not-allowed" : "pointer",
                                backgroundColor: disabledPasswordChange ? "#1a1a1a" : "#ff6d00",
                            }}
                            onClick={changePassword}
                        >
                            Change Password
                        </button>
                    </div>
                    <Toaster />
                </div>
            )}
        </>
    );
}
