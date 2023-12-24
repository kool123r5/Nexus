import "./CardGrid.css";
import PropTypes from "prop-types";
import wrapText from "../functions/wrapText";

export default function Card({ title, text }) {
    let wrapped_text = wrapText(text, 20);
    return (
        <div className="card">
            <h4>{title}</h4>
            <p>{wrapped_text}</p>
        </div>
    );
}

Card.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
};
