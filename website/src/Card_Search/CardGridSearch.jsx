import { useNavigate } from "react-router-dom";
import "./CardGridSearch.css";
import PropTypes from "prop-types";
import wrapText from "../functions/wrapText";

export default function Card_Search({ title, text, author, id, activity }) {
    let wrapped_text = wrapText(text, 30);
    const navigate = useNavigate();

    function showFullActivity() {
        if (activity) {
            navigate(`/activity/${id}`);
        } else {
            navigate(`/forum/${id}`);
        }
    }

    return (
        <div className="card_search" onClick={showFullActivity}>
            <div className="card_search_title_container">
                <h4 className="card_search_title_text">{title}</h4>
            </div>
            <div className="card_search_body_container">
                <p className="card_search_body_text">{wrapped_text}</p>
            </div>
            <div className="card_search_author_container">
                <p className="card_search_author_text">{author}</p>
            </div>
        </div>
    );
}

Card_Search.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    author: PropTypes.string,
    id: PropTypes.string,
    activity: PropTypes.bool,
};
