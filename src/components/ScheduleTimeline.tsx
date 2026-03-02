"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Clock, Users, Trophy } from "lucide-react";
import ShimmerText from "@/components/ShimmerText";

gsap.registerPlugin(ScrollTrigger);

const SCHEDULE = [
    {
        time: "09:00 AM",
        title: "Registration & Welcome",
        description: "Collect your ID cards and welcome kit at the main reception.",
        icon: Users,
    },
    {
        time: "10:00 AM",
        title: "Inaugural Ceremony",
        description: "Official lighting of the lamp and keynote address by Chief Guest.",
        icon: MapPin,
    },
    {
        time: "11:15 AM",
        title: "Paper Presentations",
        description: "Concurrent sessions across all department blocks.",
        icon: Clock,
    },
    {
        time: "01:00 PM",
        title: "Lunch Break",
        description: "Networking lunch at the main cafeteria.",
        icon: Users,
    },
    {
        time: "02:00 PM",
        title: "Technical & Non-Technical Events",
        description: "Participate in quizzes, coding challenges, and fun events.",
        icon: Trophy,
    },
    {
        time: "04:30 PM",
        title: "Valedictory & Prize Distribution",
        description: "Honoring the winners and closing ceremony.",
        icon: Trophy,
    }
];

export default function ScheduleTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const items = gsap.utils.toArray<HTMLElement>('.timeline-item');

        items.forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    }
                }
            );

            // Animate the connecting line
            const line = item.querySelector('.timeline-line');
            if (line) {
                gsap.from(line, {
                    scaleY: 0,
                    transformOrigin: "top",
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 75%",
                    }
                });
            }
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 md:py-32 bg-background relative overflow-hidden" id="schedule">
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
                <div className="text-center mb-20 md:mb-28">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <span className="w-10 h-[1px] bg-primary/50"></span>
                        <span className="text-primary font-bold tracking-[0.2em] text-sm uppercase">Vyugam '26 Itinerary</span>
                        <span className="w-10 h-[1px] bg-primary/50"></span>
                    </div>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tighter drop-shadow-sm uppercase">
                        Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300 italic font-serif">Schedule</span>
                    </h2>
                    <p className="text-muted-foreground mt-6 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        A fully packed agenda of learning, competition, and networking. Plan your ultimate experience.
                    </p>
                </div>

                <div className="relative">
                    {/* Central Vertical Glowing Line (Visible on md+) */}
                    <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2">
                        <div className="absolute top-0 left-0 w-full h-[20%] bg-gradient-to-b from-primary to-transparent animate-pulse filter blur-[1px]"></div>
                    </div>

                    <div className="space-y-16 md:space-y-0 relative">
                        {SCHEDULE.map((event, index) => {
                            const isEven = index % 2 === 0;
                            const Icon = event.icon;

                            return (
                                <div key={index} className={`timeline-item relative flex flex-col md:flex-row items-center w-full ${isEven ? 'md:justify-start' : 'md:justify-end'} group`}>
                                    {/* Mobile/Tablet Vertical Line connecting items */}
                                    {index !== SCHEDULE.length - 1 && (
                                        <div className="md:hidden absolute left-[28px] top-20 bottom-[-64px] w-[2px] bg-gradient-to-b from-primary/30 to-transparent timeline-line"></div>
                                    )}

                                    {/* Content Card */}
                                    <div className={`w-full md:w-[45%] pl-16 md:pl-0 pt-2 md:pt-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 text-left'}`}>
                                        <div className="relative bg-card/20 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] hover:border-primary/40 hover:bg-card/40 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(255,196,0,0.1)] hover:-translate-y-1 group-hover:scale-[1.02]">
                                            <span className="inline-block text-primary font-black tracking-[0.15em] text-sm mb-4 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                                                {event.time}
                                            </span>
                                            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 transition-colors">{event.title}</h3>
                                            <p className="text-muted-foreground/90 text-base leading-relaxed">{event.description}</p>
                                        </div>
                                    </div>

                                    {/* Central Icon */}
                                    <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-14 h-14 md:w-16 md:h-16 rounded-full bg-background border border-primary/30 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(255,196,0,0.2)] group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(255,196,0,0.4)] transition-all duration-500 group-hover:scale-110">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"></div>
                                            <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary relative z-10" />
                                        </div>
                                    </div>

                                    {/* Connecting horizontal dash for desktop */}
                                    <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-8 h-[2px] bg-primary/30 group-hover:bg-primary transition-colors duration-500 ${isEven ? 'right-[45%] translate-x-full' : 'left-[45%] -translate-x-full'}`}></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
