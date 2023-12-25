import "./CardGrid.css";
import PropTypes from "prop-types";

function wrapText(text, chunkSize) {
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

export default function Card({ title, text }) {
  // let wrapped_text = wrapText(text, 20);
  let wrapped_text_arr = [];
  text.forEach((tex) => {
    let wrapped_text = wrapText(tex, 20);
    wrapped_text_arr.push(wrapped_text);
  });
  return (
    <div className="card">
      {title.map((title) => (
        <h4 key={title}>{title}</h4>
      ))}
      {wrapped_text_arr.map((tex) => (
        <h4 key={tex}>{tex}</h4>
      ))}
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.array,
  text: PropTypes.array,
};
