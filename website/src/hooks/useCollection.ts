import { useEffect, useState, useRef } from "react";
import { projectFirestore } from "../firebase/config";

export const useCollection = (collection: string, _query?: Array<string>, _orderBy?) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState<string | null>(null);

    // if we don't use a ref --> infinite loop in useEffect
    // _query is an array and is "different" on every function call
    const query = useRef(_query).current;
    console.log(...query);
    const orderBy = useRef(_orderBy).current;
    try {
        useEffect(() => {
            let ref = projectFirestore.collection(collection);

            if (query) {
                ref = ref.where(...query);
            }
            if (orderBy) {
                ref = ref.orderBy(...orderBy);
            }

            const unsubscribe = ref.onSnapshot(
                (snapshot) => {
                    const results = [];
                    snapshot.docs.forEach((doc) => {
                        results.push({ ...doc.data(), id: doc.id });
                    });

                    // update state
                    setDocuments(results);
                    setError(null);
                },
                (error) => {
                    console.log(error);
                    setError("could not fetch the data");
                }
            );

            // unsubscribe on unmount
            return () => unsubscribe();
        }, [collection, query, orderBy]);
    } catch (err) {
        console.log(err);
    }

    return { documents, error };
};
