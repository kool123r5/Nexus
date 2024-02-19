export default function getUniqueTypes(documentArray) {
    // [{type:y}, {type:x}]
    const uniqueTypes = [];

    for (let index = 0; index < documentArray.length; index++) {
        const documentObject = documentArray[index];

        documentObject.tags.forEach((type) => {
            let foundType = false;
            let indexWhereFound = -1;
            for (let i = 0; i < uniqueTypes.length; i++) {
                const item = uniqueTypes[i];
                if (type in item) {
                    foundType = true;
                    indexWhereFound = i;
                    break;
                }
            }

            if (!foundType) {
                let objectToPush = {
                    [type]: [index],
                };
                uniqueTypes.push(objectToPush);
            } else {
                let currentObject = uniqueTypes[indexWhereFound];
                let index_arr = currentObject[type];
                index_arr.push(index);
                let newObject = {
                    [type]: index_arr,
                };
                uniqueTypes[indexWhereFound] = newObject;
            }
        });
    }

    return uniqueTypes;
}
