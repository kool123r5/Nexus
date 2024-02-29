export default function wrapText(text, size) {
    if (text.length > size) {
        const wrappedText = text.slice(0, size) + "...";
        return wrappedText;
    } else {
        return text;
    }
}
