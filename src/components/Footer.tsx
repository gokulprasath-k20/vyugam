"use client";

import ShimmerText from "@/components/ShimmerText";

export default function Footer() {
    return (
        <footer className="w-full bg-background border-t border-border/20 pt-24 pb-12 z-20 relative overflow-hidden">
            {/* Subtle premium glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

            <div className="container px-4 lg:px-8 mx-auto max-w-7xl">

                {/* Large watermark / Logo Area */}
                <div className="w-full flex justify-center mb-20 opacity-20 hover:opacity-100 transition-opacity duration-1000">
                    <h2 className="text-[12vw] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-background select-none pointer-events-none">
                        VYUGAM <span className="italic font-serif">26</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 mb-20 relative z-10">

                    {/* Patron Section */}
                    <div className="flex flex-col gap-6 items-center text-center group">
                        <div className="flex items-center gap-3 w-full justify-center">
                            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-primary/30 max-w-[40px]"></span>
                            <h3 className="text-xs uppercase tracking-[0.3em] font-black text-primary/80 group-hover:text-primary transition-colors">Patron</h3>
                            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-primary/30 max-w-[40px]"></span>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight group-hover:scale-105 transition-transform">Dr. J. Sundararajan</p>
                            <p className="text-sm text-muted-foreground mt-2 font-medium">M.Tech., Ph.D</p>
                            <div className="mt-5 bg-primary/5 text-primary text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full border border-primary/20 tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(255,196,0,0.05)]">
                                Principal
                            </div>
                        </div>
                    </div>

                    {/* Convenors Section */}
                    <div className="flex flex-col gap-6 items-center text-center md:border-x border-border/20 px-4 group">
                        <div className="flex items-center gap-3 w-full justify-center">
                            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-primary/30 max-w-[40px]"></span>
                            <h3 className="text-xs uppercase tracking-[0.3em] font-black text-primary/80 group-hover:text-primary transition-colors">Convenors</h3>
                            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-primary/30 max-w-[40px]"></span>
                        </div>
                        <div className="flex flex-col gap-8 w-full">
                            <div className="flex gap-6 sm:gap-10 justify-center w-full">
                                <div className="flex flex-col items-center">
                                    <p className="text-base sm:text-lg font-bold text-foreground group-hover:text-white transition-colors">Dr. R. Viswanathan</p>
                                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 font-medium tracking-wide">M.E., Ph.D</p>
                                </div>
                                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-border/60 to-transparent"></div>
                                <div className="flex flex-col items-center">
                                    <p className="text-base sm:text-lg font-bold text-foreground group-hover:text-white transition-colors">Dr. D.R. Joshua</p>
                                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 font-medium tracking-wide">M.E., Ph.D</p>
                                </div>
                            </div>
                            <div className="mx-auto bg-primary/5 text-primary text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full border border-primary/20 tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(255,196,0,0.05)] mt-[-0.5rem]">
                                Vice Principals
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="flex flex-col gap-6 items-center text-center group">
                        <div className="flex items-center gap-3 w-full justify-center">
                            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-foreground/20 max-w-[40px]"></span>
                            <h3 className="text-xs uppercase tracking-[0.3em] font-black text-foreground/50 group-hover:text-foreground/80 transition-colors">Location</h3>
                            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-foreground/20 max-w-[40px]"></span>
                        </div>
                        <div className="flex flex-col items-center h-full justify-center mt-[-1rem]">
                            <p className="text-xl sm:text-2xl font-black text-foreground mb-3 tracking-tight group-hover:scale-105 transition-transform">AVS Engineering College</p>
                            <p className="text-muted-foreground text-center text-sm font-medium leading-relaxed max-w-[220px]">
                                Military Road, Ammapet, <br />Salem - 636 003
                            </p>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 w-full">
                    <p className="text-xs sm:text-sm text-muted-foreground tracking-wide font-medium">
                        © 2026 Vyugam Symposium. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">Designed for</span>
                        <div className="px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 hover:scale-105 transition-transform cursor-default shadow-[0_0_10px_rgba(255,196,0,0.1)]">
                            <ShimmerText text="Vyugam '26" className="font-black tracking-tighter text-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
