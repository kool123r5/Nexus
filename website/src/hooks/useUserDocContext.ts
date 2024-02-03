import { UserDocContext } from "../context/UserDocContext";
import { useContext } from "react";

export const useUserDocContext = () => {
    const context = useContext(UserDocContext);

    if (!context) {
        throw Error("useUserDocContext must be used inside an UserDocContextProvider");
    }

    return context;
};
