import PropTypes from "prop-types";
import { Chip } from "@mantine/core";
import "./Interest.css";

export const Interest = ({ text, interests, setInterests, isInInterestsPreviously }) => {
    return (
        <Chip
            size="lg"
            className="chip"
            checked={isInInterestsPreviously}
            onChange={() => {
                if (!interests.includes(text)) {
                    setInterests([...interests, text]);
                } else {
                    const index = interests.indexOf(text);
                    if (index > -1) {
                        // only splice array when item is found
                        interests.splice(index, 1); // 2nd parameter means remove one item only
                    }
                    setInterests([...interests]);
                }
            }}
        >
            <p>{text}</p>
        </Chip>
    );
};

Interest.propTypes = {
    text: PropTypes.string,
    interests: PropTypes.array,
    setInterests: PropTypes.func,
    isInInterestsPreviously: PropTypes.bool,
};
