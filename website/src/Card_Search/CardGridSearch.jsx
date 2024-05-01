import { useNavigate } from "react-router-dom";
import "./CardGridSearch.css";
import PropTypes from "prop-types";
import wrapText from "../functions/wrapText";
import { Badge } from "@mantine/core";

export default function Card_Search({ title, text, card_tag, activity_cost, selective_bool, author, id, activity }) {
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
            {/* <div className="card_search_activity_details_container">
                <div className="card_search_each_detail_container" id = "search_cost_detail_container">
                    {activity_cost[0] ? (
                        <>
                            {activity_cost[1] == "unknown" || activity_cost[2] == "unknown" ? (
                                <p className="cost_details_search">
                                    Costs Money
                                </p>
                            ) : (
                                <p className="cost_details_search">
                                    Costs {activity_cost[1]} {activity_cost[2]}
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="cost_details_search">
                            Free
                        </p>
                    )}
                </div>
                <div className="card_search_each_detail_container" id = "search_selective_detail_container">
                    {selective_bool ? (
                        <p className="cost_details_search">Selective</p>
                    ) : (
                        <p className="cost_details_search">Not Selective</p>
                    )}
                </div>
            </div> */}
            <div className="card_search_tags_container">
                {card_tag != "unknown" &&
                    card_tag.length != 0 &&
                    card_tag.map((c, index) => {
                        return (
                            <Badge className="badge" key={index} color="#ff6d00">
                                {c}
                            </Badge>
                        );
                    })}
            </div>
            {/* <div className="card_search_body_container">{wrapped_text}</div> */}
            {author != "unknown" && author != undefined && <div className="card_search_author_container">{author}</div>}
        </div>
    );
}

Card_Search.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    card_tag: PropTypes.array,
    activity_cost: PropTypes.array,
    selective_bool: PropTypes.bool,
    author: PropTypes.string,
    id: PropTypes.string,
    activity: PropTypes.bool,
};
