import "./EmailTemplate.css";

export default function EmailTemplate() {
    const queryString = window.location.search;
    const urlSearchParams = new URLSearchParams(queryString);
    const afterSignup = urlSearchParams.get("signup") == "true";
    const email = urlSearchParams.get("email");

    return (
        <div className="authActionContainer">
            {afterSignup ? (
                <div className="verifyEmailAfterSignupDiv">
                    <h3 className="verifyYourEmailTitle">
                        Verify your email - <span className="emailSpanAuthAction">{email}</span>
                    </h3>
                    <p>We sent a link to your inbox</p>
                </div>
            ) : null}
        </div>
    );
}
