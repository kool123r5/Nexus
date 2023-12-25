import "./CardGrid.css";
import PropTypes from "prop-types";

function wrapText(text, chunkSize) {
    const words = text.split(" ");
    let wrappedText = "";
    let currentLine = "";
    let newLineCount = 0;

    for (const word of words) {
        if ((currentLine + word).length <= chunkSize) {
            currentLine += (currentLine === "" ? "" : " ") + word;
        } else {
            wrappedText += (wrappedText === "" ? "" : "\n") + currentLine;
            currentLine = word;
            newLineCount++;

            if (newLineCount === 7) {
                break;
            }
        }
    }

    wrappedText += (wrappedText === "" ? "" : "\n") + currentLine;

    if (newLineCount >= 7) {
        wrappedText += "...";
    }

    return wrappedText;
}

export default function Card({ title, text, author, id }) {
    let wrapped_text = wrapText(text, 20);

    function showFullActivity() {
        location.href = location.href + "activity/" + id;
    }

    return (
        <div className="card">
            <h4>{title}</h4>
            <p>{wrapped_text}</p>
            <p>By: {author}</p>
            <button onClick={showFullActivity}>View Details</button>
        </div>
    );
}

Card.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    author: PropTypes.string,
    id: PropTypes.string,
};
