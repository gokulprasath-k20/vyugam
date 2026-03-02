"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function EventHighlights() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.highlight-card');

        gsap.fromTo(cards,
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                }
            }
        );
    }, { scope: containerRef });

    const highlights = [
        {
            icon: <CalendarDays className="w-8 h-8 text-primary" />,
            title: "March 6, 2026",
            subtitle: "Mark your calendars",
            description: "A full day packed with competitive events, presentations, and technical excellence starting at 9:00 AM."
        },
        {
            icon: <MapPin className="w-8 h-8 text-primary" />,
            title: "AVS Engineering",
            subtitle: "Salem Campus",
            description: "Join us at the premium technical campus equipped with state-of-the-art facilities for all events."
        },
        {
            icon: <Trophy className="w-8 h-8 text-primary" />,
            title: "Prizes Upto 1 Lakh",
            subtitle: "Win big rewards",
            description: "Compete against the best minds and stand a chance to win exciting cash prizes and certificates."
        },
        {
            icon: <Users className="w-8 h-8 text-primary" />,
            title: "10+ Departments",
            subtitle: "Diverse domains",
            description: "Events tailored across various engineering disciplines, management, and foundational sciences."
        },
    ];

    return (
        <section ref={containerRef} className="py-24 relative z-20 bg-card/20 border-y border-border/20 backdrop-blur-2xl -mt-8 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,196,0,0.02),transparent_40%)] pointer-events-none" />
            <div className="container mx-auto px-4 max-w-[90rem]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {highlights.map((item, index) => (
                        <div
                            key={index}
                            className="highlight-card relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl" />
                            <div className="relative h-full bg-background/40 backdrop-blur-xl border border-border/40 shadow-xl rounded-3xl p-8 hover:border-primary/30 transition-all duration-500 overflow-hidden transform group-hover:-translate-y-2 group-hover:shadow-primary/5">
                                {/* Top-right decorative accent */}
                                <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-8 group-hover:scale-[1.15] group-hover:rotate-3 transition-transform duration-500 border border-primary/20 shadow-inner">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-black text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">{item.subtitle}</h4>
                                <p className="text-foreground/70 leading-relaxed font-medium">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
