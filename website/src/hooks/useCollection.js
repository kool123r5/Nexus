import { useEffect, useState, useRef } from "react";
import { projectFirestore } from "../firebase/config";

export const useCollection = (collection, _query, _orderBy, _limit, localStorageData) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);

    // if we don't use a ref --> infinite loop in useEffect
    // _query is an array and is "different" on every function call
    const query = useRef(_query).current;
    const orderBy = useRef(_orderBy).current;
    const limit = useRef(_limit).current;

    useEffect(() => {
        if (localStorageData == null || localStorageData.length == 0) {
            let ref = projectFirestore.collection(collection);

            if (query) {
                ref = ref.where(...query);
            }

            if (orderBy) {
                ref = ref.orderBy(...orderBy);
            }

            if (limit) {
                ref = ref.limit(limit);
            }

            const unsubscribe = ref.onSnapshot(
                (snapshot) => {
                    let results = [];
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
        } else {
            setDocuments(JSON.parse(localStorageData));
            setError(null);
        }
    }, [collection, query, orderBy, limit, localStorageData]);

    return { documents, error };
};
