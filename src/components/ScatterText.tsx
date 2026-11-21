/**
 * Splits a line into word/character spans so GSAP can scatter every glyph on
 * its own. Words stay inline-block (no mid-word wrapping), spaces stay text
 * nodes between them, so line breaking is unchanged from plain text.
 */
export default function ScatterText({
  text,
  wordClassName,
}: {
  text: string;
  wordClassName?: string;
}) {
  const words = text.split(" ");

  return (
    <span className="scatter">
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`}>
          <span className={`scatter__word${wordClassName ? ` ${wordClassName}` : ""}`}>
            {Array.from(word).map((char, ci) => (
              <span className="scatter__char" key={ci}>
                {char}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
