/**
 * ShimmerText — renders any text with a gold-to-white shimmer animation sweeping the whole text.
 */
export default function ShimmerText({ text, className = "" }: { text: string; className?: string }) {
    return (
        <span
            aria-label={text}
            className={`inline-block ${className}`}
            style={{
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                backgroundImage: "linear-gradient(110deg, #ffc400 20%, #ffffff 40%, #ffe066 60%, #ffc400 80%)",
                backgroundSize: "300% auto",
                color: "transparent",
                animation: "shimmer 2.5s linear infinite",
            }}
        >
            {text}
        </span>
    );
}
