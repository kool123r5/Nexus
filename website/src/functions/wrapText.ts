export default function wrapText(text, chunkSize) {
    const words = text.split(" ");
    let wrappedText = "";
    let currentLine = "";
    let newLineCount = 0;

    for (const word of words) {
        if ((currentLine + word).length <= chunkSize) {
            currentLine += (currentLine === "" ? "" : " ") + word;
        } else {
            wrappedText += (wrappedText === "" ? "" : "\n") + currentLine;
            currentLine = word;
            newLineCount++;

            if (newLineCount === 7) {
                break;
            }
        }
    }

    wrappedText += (wrappedText === "" ? "" : "\n") + currentLine;

    if (newLineCount >= 7) {
        wrappedText += "...";
    }

    return wrappedText;
}
