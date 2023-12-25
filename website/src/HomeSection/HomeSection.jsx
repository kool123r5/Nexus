import "./HomeSection.css";
import Card from "../Card/CardGrid";
import PropTypes from "prop-types";

export default function HomeSection({ uniqueTypeObj, sorted_documents }) {
    let type = Object.keys(uniqueTypeObj);
    let index_array = uniqueTypeObj[type];
    let postObjectArray = [];
    for (let i = 0; i < index_array.length; i++) {
        const index = index_array[i];
        const documentObject = sorted_documents[index];
        postObjectArray.push({
            title: documentObject.title,
            text: documentObject.text,
            author: documentObject.username,
            id: documentObject.id,
        });
    }
    return (
        <div>
            <h2>{type}</h2>
            {postObjectArray.map((postObject) => {
                return (
                    <Card
                        key={postObject + Math.random()}
                        title={postObject.title}
                        text={postObject.text}
                        author={postObject.author}
                        id={postObject.id}
                    />
                );
            })}
        </div>
    );
}

HomeSection.propTypes = {
    uniqueTypeObj: PropTypes.object,
    sorted_documents: PropTypes.array,
};
