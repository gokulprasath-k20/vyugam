"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Countdown from "./Countdown";
import { ArrowRight, Trophy } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Parallax background
        gsap.to(bgRef.current, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

        // Elegant fade-up animation
        gsap.fromTo(
            ".hero-animate",
            { y: 40, opacity: 0, scale: 0.98 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.2,
                stagger: 0.15,
                ease: "expo.out",
                delay: 0.2,
            }
        );
    }, { scope: containerRef });

    const router = useRouter();

    return (
        <section
            ref={containerRef}
            className="relative h-screen min-h-[650px] pb-16 w-full flex flex-col bg-background overflow-hidden"
        >
            {/* Minimalist Ambient Background */}
            <div ref={bgRef} className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-primary/10 blur-[100px] rounded-full opacity-60"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full h-full flex flex-col px-4 sm:px-6 lg:px-8">

                {/* Logo Top */}
                <div className="w-full flex justify-center pt-6 sm:pt-10 hero-animate shrink-0">
                    <img
                        src="https://www.avsenggcollege.ac.in/img/logo%20at-02.png"
                        alt="AVS Engineering College"
                        className="h-24 sm:h-16 md:h-20 object-contain opacity-90 hover:opacity-100 transition-opacity"
                    />
                </div>

                {/* Main Hero Content - Vertically Centered */}
                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto py-6 sm:py-8 gap-6 sm:gap-8">

                    {/* Typography Area */}
                    <div className="flex flex-col items-center text-center gap-2 sm:gap-4 mt-2 sm:mt-4">
                        <div className="relative hero-animate">
                            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50 animate-pulse mix-blend-screen pointer-events-none" />
                            <h1
                                className="relative z-10 text-[3.5rem] leading-none sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter text-center uppercase"
                                style={{
                                    backgroundImage: "linear-gradient(110deg, #ffc400 20%, #ffffff 45%, #ffd966 65%, #ffc400 85%)",
                                    backgroundSize: "300% auto",
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    color: "transparent",
                                    animation: "shimmer 3s ease-in-out infinite alternate",
                                    paddingBottom: "0.1em",
                                }}
                            >
                                VYUGAM <span className="text-primary italic font-serif tracking-tight">'26</span>
                            </h1>
                        </div>

                        <h2 className="hero-animate text-lg sm:text-2xl md:text-3xl lg:text-4xl text-foreground/90 font-medium tracking-tight text-center max-w-3xl mt-[-0.5rem] sm:mt-[-1rem]">
                            A National Level Technical Symposium
                        </h2>
                    </div>

                    {/* Interactive Elements / Call to Action */}
                    <div className="hero-animate flex flex-col items-center gap-6 sm:gap-8 w-full mt-2">

                        {/* Countdown snippet, properly simplified */}
                        <div className="w-full flex justify-center">
                            <div className="rounded-3xl p-6 w-full max-w-4xl transform hover:scale-[1.02] transition-transform duration-500">
                                <Countdown />
                            </div>
                        </div>

                        {/* Action Buttons & Prizes */}
                        <div className="flex flex-col sm:flex-row items-center gap-4  sm:gap-6">
                            <Button
                                size="lg"
                                className="group relative overflow-hidden rounded-full px-10 py-7 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 shadow-[0_4px_30px_rgba(255,196,0,0.3)]"
                                onClick={() => router.push('/register')}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Register Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-12 group-hover:animate-[shimmer_1.5s_infinite]" />
                            </Button>

                            <div className="flex items-center gap-3 px-6 py-4 rounded-full bg-muted/30 border border-border backdrop-blur-md">
                                <Trophy className="w-5 h-5 text-primary" />
                                <span className="text-sm font-semibold text-foreground/80 tracking-wide">
                                    Prize Pool: <span className="text-primary font-bold">₹ Upto 1 Lakh</span>
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
