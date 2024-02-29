import { useNavigate } from "react-router-dom";
import "./CardGridForum.css";
import PropTypes from "prop-types";
import wrapText from "../functions/wrapText";

export default function Card_Forum({ title, text, author, id, activity }) {
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
        <div className="card_forum" onClick={showFullActivity}>
            <div className="card_forum_title_container">
                <h4 className="card_forum_title_text">{title}</h4>
            </div>
            <div className="card_forum_body_container">
                <p className="card_forum_body_text">{wrapped_text}</p>
            </div>
            <div className="card_forum_author_container">
                <p className="card_forum_author_text">{author}</p>
            </div>
        </div>
    );
}

Card_Forum.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    author: PropTypes.string,
    id: PropTypes.string,
    activity: PropTypes.bool,
};
