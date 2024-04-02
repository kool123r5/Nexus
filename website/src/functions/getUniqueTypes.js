export default function getUniqueTypes(documentArray) {
    // TODO: fix this whole function
    // i'm sorry for writing such bad code
    // i'm not even sure what this does anymore
    // looks as though it gets [x: [0], y: [1]] from [{type: x}, {type: y}]
    // i'll rewrite this soon enough
    // this is used to make the design that arjun says is bad anyways
    // so we might be able to scrap this whole thing
    const uniqueTypes = [];

    for (let index = 0; index < documentArray.length; index++) {
        const documentObject = documentArray[index];
        if (documentObject.tags != "unknown") {
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
    }

    return uniqueTypes;
}
