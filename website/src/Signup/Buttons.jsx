import { IconArrowNarrowRight, IconArrowNarrowLeft, IconCheck } from "@tabler/icons-react";
import PropTypes from "prop-types";

export const NextButton = ({ nextStep }) => {
    return (
        <div className="sign_up_next_button_container">
            <button onClick={nextStep} className="sign_up_next_button">
                <div
                    style={{
                        display: "flex",
                    }}
                >
                    <IconArrowNarrowRight size={35} />
                </div>
            </button>
        </div>
    );
};

export const PrevButton = ({ prevStep }) => {
    return (
        <div className="sign_up_prev_button_container">
            <button type="submit" onClick={prevStep} className="sign_up_prev_button">
                <div
                    style={{
                        display: "flex",
                    }}
                >
                    <IconArrowNarrowLeft size={35} />
                </div>
            </button>
        </div>
    );
};

export const SubmitButton = ({ handleSubmit }) => {
    return (
        <div className="sign_up_submit_button_container">
            <button type="submit" className="sign_up_submit_button" onClick={handleSubmit}>
                <div
                    style={{
                        display: "flex",
                    }}
                >
                    <IconCheck size={35} />
                </div>
            </button>
        </div>
    );
};

NextButton.propTypes = {
    nextStep: PropTypes.func,
};

PrevButton.propTypes = {
    prevStep: PropTypes.func,
};

SubmitButton.propTypes = {
    handleSubmit: PropTypes.func,
};
