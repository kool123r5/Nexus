import { useNavigate } from "react-router-dom";
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

export default function Card({ title, text, author, id, activity }) {
    let wrapped_text = wrapText(text, 20);
    const navigate = useNavigate();

    function showFullActivity() {
        if (activity) {
            navigate(`/activity/${id}`);
        } else {
            navigate(`/forum/${id}`);
        }
    }

    return (
        <div className="card" onClick={showFullActivity}>
            <div className="card_title_container">
                <h4 className="card_title_text">{title}</h4>
            </div>
            <div className="card_body_container">
                <p className="card_body_text">{wrapped_text}</p>
            </div>
            <div className="card_author_container">
                <p className="card_author_text">{author}</p>
            </div>
        </div>
    );
}

Card.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    author: PropTypes.string,
    id: PropTypes.string,
    activity: PropTypes.bool,
};
