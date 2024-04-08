import { useNavigate } from "react-router-dom";
import "./CardGrid.css";
import PropTypes from "prop-types";
import wrapText from "../functions/wrapText";

export default function Card({ title, text, author, id, activity }) {
    let wrapped_text = wrapText(text, 70);
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
