"use client";

import { useState, useEffect } from "react";

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const targetDate = new Date("2026-03-06T09:00:00").getTime();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [mounted]);

    if (!mounted) {
        return <div className="h-[100px] flex items-center justify-center opacity-0 transition-opacity duration-1000">Loading countdown...</div>;
    }

    const timeBlocks = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
    ];

    return (
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full mt-2 lg:mt-6">
            {timeBlocks.map((block, index) => (
                <div key={block.label} className="flex items-center gap-4 sm:gap-6">
                    <div className="relative group perspective-1000">
                        {/* Soft Glow Behind */}
                        <div className="absolute -inset-1 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />

                        {/* Glassmorphic Panel */}
                        <div className="relative flex flex-col items-center justify-center min-w-[5rem] sm:min-w-[6.5rem] h-20 sm:h-24 bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                            {/* Reflection highlight */}
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                            <span className="text-3xl sm:text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,196,0,0.3)]">
                                {String(block.value).padStart(2, '0')}
                            </span>
                            <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-primary/80 font-semibold mt-1">
                                {block.label}
                            </span>
                        </div>
                    </div>

                    {/* Separator */}
                    {index < timeBlocks.length - 1 && (
                        <div className="flex flex-col gap-2 opacity-50 hidden sm:flex">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
