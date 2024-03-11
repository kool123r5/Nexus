export default function unixTimestampStringPastTimeLimit(unixTimestampString, customTimeLimit) {
    let timelimit = 1000 * 60 * 60; // 1 hour by default, feel free to change it
    if (
        customTimeLimit != null &&
        customTimeLimit != undefined &&
        customTimeLimit > 0 &&
        typeof customTimeLimit == "number"
    ) {
        timelimit = customTimeLimit;
    }

    const currentTime = Date.now();
    const timeToCheck = parseInt(unixTimestampString);
    const differenceInMS = currentTime - timeToCheck;
    if (differenceInMS > timelimit) {
        return true;
    } else {
        return false;
    }
}
