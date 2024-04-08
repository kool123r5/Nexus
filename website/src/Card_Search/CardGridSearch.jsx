import { useNavigate } from "react-router-dom";
import "./CardGridSearch.css";
import PropTypes from "prop-types";
import wrapText from "../functions/wrapText";

export default function Card_Search({ title, text, author, id, activity }) {
    let wrapped_text = wrapText(text, 200);
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
            <div className="card_search_title_container">{title}</div>
            <div className="card_search_body_container">{wrapped_text}</div>
            <div className="card_search_author_container">{author}</div>
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
