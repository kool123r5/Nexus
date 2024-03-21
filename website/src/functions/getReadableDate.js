export default function getReadableDate(dateIn) {
    // this is in format of: "Wed, 05 Oct 2011 14:48:00 GMT"
    const utcString = dateIn.toUTCString();
    const removedDayFromUTCString = utcString.split(",")[1].trim();
    const date = removedDayFromUTCString.split(" ")[0];
    const month = removedDayFromUTCString.split(" ")[1];
    const year = removedDayFromUTCString.split(" ")[2];
    return `${date} ${month} ${year}`;
}
