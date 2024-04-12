export default function flattenAndUnique(arr2D) {
    // Use a Set to store unique values
    const uniqueValues = new Set();

    // Flatten the 2D array and add unique values to the Set
    arr2D.forEach((subArr) => {
        subArr.forEach((str) => {
            uniqueValues.add(str);
        });
    });

    // Convert the Set back to an array and return it
    return Array.from(uniqueValues);
}
