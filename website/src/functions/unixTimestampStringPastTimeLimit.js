export default function unixTimestampStringPastTimeLimit(unixTimestampString) {
    const timelimit = 1000 * 60 * 5; // 5 minutes, feel free to change it
    const currentTime = Date.now();
    const timeToCheck = parseInt(unixTimestampString);
    const differenceInMS = currentTime - timeToCheck;
    if (differenceInMS > timelimit) {
        return true;
    } else {
        return false;
    }
}
