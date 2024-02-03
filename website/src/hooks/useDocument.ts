import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";

export const useDocument = (collection: string, id: string) => {
    const [document, setDocument] = useState<{
        id: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // realtime document data
    useEffect(() => {
        const ref = projectFirestore.collection(collection).doc(id);

        const unsubscribe = ref.onSnapshot(
            (snapshot) => {
                // need to make sure the doc exists & has data
                if (snapshot.data()) {
                    setDocument({ ...snapshot.data(), id: snapshot.id });
                    setError(null);
                } else {
                    setError("No such document exists");
                }
            },
            (err) => {
                console.log(err.message);
                setError("failed to get document");
            }
        );

        // unsubscribe on unmount
        return () => unsubscribe();
    }, [collection, id]);

    return { document, error };
};
