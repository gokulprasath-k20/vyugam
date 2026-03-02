import { Metadata } from 'next';
import RegistrationForm from '@/components/RegistrationForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import ShimmerText from '@/components/ShimmerText';

export const metadata: Metadata = {
    title: "Register | Vyugam '26",
    description: "Register for the biggest national level technical symposium.",
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col md:flex-row">
            {/* Decorative Background for the page */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-card/30 via-background to-background z-0"></div>

            {/* Dynamic 3D/Branding Left Side (Hidden on Mobile) */}
            <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-card/10 z-10 border-r border-border/20 backdrop-blur-2xl">
                {/* Top Header */}
                <div>
                    <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium tracking-wide">Back to Home</span>
                    </Link>
                </div>

                {/* Center Content */}
                <div className="flex-grow flex flex-col justify-center max-w-lg">
                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-foreground leading-[1.1] drop-shadow-lg">
                        Experience <br /> The <span className="text-primary italic font-serif relative">Future
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </span>
                    </h1>
                    <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
                        Vyugam &apos;26 brings together the brightest minds across multiple engineering disciplines to compete, innovate, and inspire.
                    </p>

                    <div className="mt-12 flex items-center gap-4">
                        <div className="w-16 h-1 bg-primary/20 rounded-full overflow-hidden">
                            <div className="w-1/3 h-full bg-primary rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-sm font-bold tracking-widest text-primary uppercase">Limited Seats</span>
                    </div>
                </div>

                {/* Abstract Floating Shapes (Tailwind implementation of webgl aesthetic) */}
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }}></div>

                {/* Bottom Details */}
                <div>
                    <p className="text-sm font-medium tracking-widest text-muted-foreground/50 uppercase">
                        AVS Engineering College, Salem
                    </p>
                </div>
            </div>

            {/* Form Right Side */}
            <div className="w-full lg:w-1/2 flex flex-col pt-8 pb-16 px-4 md:px-8 z-10 bg-background/50 backdrop-blur-sm lg:overflow-y-auto">

                {/* Mobile Header (Hidden on Desktop) */}
                <div className="lg:hidden mb-8 w-full flex justify-start">
                    <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium tracking-wide">Home</span>
                    </Link>
                </div>

                {/* Form Container */}
                <div className="flex-grow flex items-center justify-center pt-8">
                    <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse">Loading registration form...</div>}>
                        <RegistrationForm isStandalone={true} />
                    </React.Suspense>
                </div>
            </div>
        </div>
    );
}
