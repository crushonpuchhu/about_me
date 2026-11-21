type Props = {
  className?: string;
  plotting?: boolean;
  title?: string;
};

/**
 * MG monogram — two strokes and a dot, drawn like a plotter would.
 * The paths use pathLength="1" so the draw-on animation is resolution free.
 */
export default function Monogram({ className = "", plotting = false, title = "Mittal Kumar Gupta" }: Props) {
  return (
    <svg
      className={`monogram ${plotting ? "is-plotting" : ""} ${className}`}
      viewBox="0 0 68 40"
      role="img"
      aria-label={title}
    >
      <path className="monogram__m" d="M4 37V4l12 18L28 4v33" pathLength="1" />
      <path className="monogram__g" d="M48.3 8.7A16 16 0 1 0 53 20H39" pathLength="1" />
      <circle className="monogram__dot" cx="60" cy="36" r="2.6" />
    </svg>
  );
}
