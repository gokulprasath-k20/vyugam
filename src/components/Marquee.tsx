"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function MarqueeRow({ timeLeft }: { timeLeft: string }) {
    return (
        <div className="flex items-center gap-8 pe-8 text-base md:text-lg font-medium tracking-wide text-foreground/80">
            <span className="flex items-center gap-2">
                Event Date: <strong className="text-primary font-bold">6th March 2026</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
            <span className="flex items-center gap-2">
                Starts in: <strong className="text-primary font-mono tracking-widest">{timeLeft}</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
            <span className="flex items-center gap-2">
                Last Date: <strong className="text-foreground font-bold">25.02.2026</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
            <span className="flex items-center gap-2">
                Acceptance: <strong className="text-foreground font-bold">01.03.2026</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
            <span className="flex items-center gap-2">
                Registration Fee: <strong className="text-foreground font-bold">Rs.200/-</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
            <span className="flex items-center gap-2 text-primary uppercase tracking-widest text-xs font-black bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                Spot Registration Available
            </span>
        </div>
    );
}

export default function Marquee() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const [timeLeft, setTimeLeft] = useState("");

    // Calculate time until March 6, 2026
    useEffect(() => {
        const targetDate = new Date("2026-03-06T09:00:00").getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                setTimeLeft("EVENT HAS STARTED");
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    useGSAP(() => {
        if (!textContainerRef.current) return;

        gsap.to(textContainerRef.current, {
            xPercent: -50,
            ease: "none",
            duration: 25,
            repeat: -1,
        });
    }, { scope: containerRef });

    const MarqueeItem = () => (
        <div className="flex items-center gap-8 pe-8 text-base md:text-lg font-medium tracking-wide text-foreground/80">
            <span className="flex items-center gap-2">
                Event Date: <strong className="text-primary font-bold">6th March 2026</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
            <span className="flex items-center gap-2">
                Starts in: <strong className="text-primary font-mono tracking-widest">{timeLeft}</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
            <span className="flex items-center gap-2">
                Last Date: <strong className="text-foreground font-bold">25.02.2026</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
            <span className="flex items-center gap-2">
                Acceptance: <strong className="text-foreground font-bold">01.03.2026</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
            <span className="flex items-center gap-2">
                Registration Fee: <strong className="text-foreground font-bold">Rs.200/-</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
            <span className="flex items-center gap-2 text-primary uppercase tracking-widest text-xs font-black bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                Spot Registration Available
            </span>
        </div>
    );

    return (
        <div className="relative z-20 w-full overflow-hidden border-y border-border/40 bg-background/60 backdrop-blur-xl">
            {/* Subtle glow behind marquee */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none"></div>

            <div
                ref={containerRef}
                className="py-5 flex whitespace-nowrap"
            >
                <div
                    ref={textContainerRef}
                    className="flex items-center shrink-0"
                >
                    <MarqueeRow timeLeft={timeLeft} />
                    <MarqueeRow timeLeft={timeLeft} />
                    <MarqueeRow timeLeft={timeLeft} />
                    <MarqueeRow timeLeft={timeLeft} />
                </div>
            </div>
        </div>
    );
}
