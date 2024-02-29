import { useEffect, useState, useRef } from "react";
import { projectFirestore } from "../firebase/config";
import unixTimestampStringPastTimeLimit from "../functions/unixTimestampStringPastTimeLimit";

export const useCollection = (collection, _query, _orderBy, _limit, localStorageKey) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);

    // if we don't use a ref --> infinite loop in useEffect
    // _query is an array and is "different" on every function call
    const query = useRef(_query).current;
    const orderBy = useRef(_orderBy).current;
    const limit = useRef(_limit).current;

    useEffect(() => {
        const localStorageData = JSON.parse(localStorage.getItem(localStorageKey));
        const timeLastFetched = parseInt(localStorage.getItem(`Time${localStorageKey}`));
        if (
            localStorageKey == null ||
            timeLastFetched == null ||
            localStorageData == null ||
            isNaN(timeLastFetched) ||
            unixTimestampStringPastTimeLimit(timeLastFetched)
        ) {
            let ref = projectFirestore.collection(collection);
            console.log("RUNNING THE DB CALL...");
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
                    localStorage.setItem(localStorageKey, JSON.stringify(results));
                    localStorage.setItem(`Time${localStorageKey}`, Date.now().toString());
                },
                (error) => {
                    console.log(error);
                    setError("could not fetch the data");
                }
            );

            // unsubscribe on unmount
            return () => unsubscribe();
        } else {
            setDocuments(localStorageData);
            setError(null);
        }
    }, [collection, query, orderBy, limit, localStorageKey]);

    return { documents, error };
};
