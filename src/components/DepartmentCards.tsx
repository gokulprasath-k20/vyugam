"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const DEPARTMENTS = [
    {
        "id": "Civil",
        "department": "Civil",
        "color": "from-stone-500/20 to-stone-900/40",
        "accent": "text-stone-400",
        "paper_topics": ["Green Building Design", "Renewable energy Integration", "Smart cities infrastructure", "Sustainable urban Transportation"],
        "technical": ["Quiz"],
        "non_technical": ["Code cracking"],
        "contact": "Mr. T.Senthilkumar (7695808089) / ce_vyugam26@avsenggcollege.ac.in",
        "student_coordinator": { "name": "R. Sriram", "phone": "8300897446" }
    },
    {
        "id": "EEE",
        "department": "EEE",
        "color": "from-amber-500/20 to-amber-900/40",
        "accent": "text-amber-400",
        "paper_topics": ["Electrical Vehicles (EVs)", "AI in Power Systems", "Renewable Energy Integration", "Smart Grid"],
        "technical": ["Quiz"],
        "non_technical": ["Electro Hunt"],
        "project_expo": ["Spark Xpo"],
        "contact": "Mr. N.Navaneethan (9994953681) / ee_vyugam26@avsenggcollege.ac.in",
        "student_coordinator": { "name": "N. Vimal", "phone": "6379135402" }
    },
    {
        "id": "CSE",
        "department": "CSE",
        "color": "from-blue-500/20 to-blue-900/40",
        "accent": "text-blue-400",
        "paper_topics": ["Serverless Computing", "Generative AI: Beyond ChatGPT", "Brain-Computer Interfaces", "DevSecOps: Security in DevOps"],
        "technical": ["Blind Coding"],
        "non_technical": ["Logo Puzzle"],
        "contact": "Mrs. S.Sivaranjani (8220356140) / cs_vyugam26@avsenggcollege.ac.in",
        "student_coordinator": { "name": "Gurumoorthi N", "phone": "9025830342" }
    },
    {
        "id": "ECE",
        "department": "ECE",
        "color": "from-emerald-500/20 to-emerald-900/40",
        "accent": "text-emerald-400",
        "paper_topics": ["6G Technology", "AI in Communication", "2nm Semiconductor Technology", "IoT-based Smart Cities & Agriculture"],
        "technical": ["Quiztron"],
        "non_technical": ["Ad-Zap"],
        "project_expo": ["Electro Xhibit"],
        "contact": "Mr. M.Rajesh (8124899799) / ec_vyugam26@avsenggcollege.ac.in",
        "student_coordinator": { "name": "D. Deepak", "phone": "6382916897" }
    },
    {
        "id": "IT",
        "department": "IT",
        "color": "from-cyan-500/20 to-cyan-900/40",
        "accent": "text-cyan-400",
        "paper_topics": ["AI & ML Applications", "Quantum Computing - Future of IT", "Chatbots and Virtual Assistants", "Digital Twins Technology"],
        "technical": ["Appathon (App Development Challenge)"],
        "non_technical": ["Ad-Zap"],
        "contact": "Mr. C.Surendarvijay (9092566376) / it_vyugam26@avsenggcollege.ac.in",
        "student_coordinator": { "name": "K. Gokul Prasath", "phone": "6380957425" }
    },
    {
        "id": "AI",
        "department": "AI & DS and MCA",
        "color": "from-fuchsia-500/20 to-fuchsia-900/40",
        "accent": "text-fuchsia-400",
        "paper_topics": ["Agentic AI", "Multimodal AI", "Edge AI", "AutoML"],
        "technical": ["Vibe Coding"],
        "non_technical": ["AI Memes", "Ad Mad"],
        "contact": "Mrs. A.Anandhi (88259 59510) / ad_vyugam26@avsenggcollege.ac.in",
        "student_coordinator": { "name": "S. Thanish", "phone": "9043294078" }
    },
    {
        "id": "MBA",
        "department": "MBA",
        "note": "[for UG Student also]",
        "color": "from-rose-500/20 to-rose-900/40",
        "accent": "text-rose-400",
        "paper_topics": ["AI in Business", "Digital Marketing", "FinTech, HR Analytics, ESG, etc.."],
        "other_events": ["Business Quiz", "Best Manager", "Product launch"],
        "contact": "Mr. Anand Ravi (9361929649) / mba_vyugam26@avsenggcollege.ac.in",
        "student_coordinator": { "name": "Aswanth Singh", "phone": "8300718835" }
    },
    {
        "id": "BME",
        "department": "BME",
        "color": "from-teal-500/20 to-teal-900/40",
        "accent": "text-teal-400",
        "paper_topics": ["Advanced Image / Signal Processing", "Brain and Neural Engineering", "Medical devices and IoT", "Robotics and Rehabilitation", "Bio informatics and Genomics", "Emerging and Future Technology in BME"],
        "technical": ["Project Expo", "Bio Quiz"],
        "non_technical": ["Adzap"],
        "contact": "Mrs. M.Krishnaveni (6380535965) / bm_vyugam26@avsenggcollege.ac.in",
        "student_coordinator": { "name": "M. Sunil", "phone": "9655161481" }
    },

    {
        "id": "Mech",
        "department": "Mechanical",
        "color": "from-orange-500/20 to-orange-900/40",
        "accent": "text-orange-400",
        "paper_topics": ["Green Energy", "AI in Manufacturing", "3D Printing Technology", "CAD/CAM", "Production Engineering", "Thermal Engineering", "Robotics"],
        "non_technical": ["Drone flying"],
        "contact": "Mr. K.Radhakrishnan (9566862454) / me_vyugam26@avsenggcollege.ac.in",
        "student_coordinator": { "name": "L. Sasi Prakash", "phone": "8939356123" }

    },
    {
        "id": "SH",
        "department": "Science & Humanities (1st Year)",
        "paper_topics": ["Language, Technology & Transformation...", "Real world Applications in Engg Maths", "The Physics of Semiconductors", "Sustainable Materials in Emerging Tech"],
        "technical": ["Quiz"],
        "non_technical": ["Just a Minute (JAM)", "Short Film"],
        "contact": "Mr. P.Sridhar (9994474479) / sh_vyugam26@avsenggcollege.ac.in",
        "student_coordinator": { "name": "L. Sasi Prakash", "phone": "8939356123" }

    },

];

export default function DepartmentCards() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedDept, setSelectedDept] = useState<typeof DEPARTMENTS[0] | null>(null);
    const router = useRouter();

    // Bulletproof body scroll lock that works on iOS, Android, and desktop
    useEffect(() => {
        if (selectedDept) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [selectedDept]);

    useGSAP(() => {
        // Stagger fade up for bento grid items using fromTo for guaranteed visibility
        gsap.fromTo(".bento-item",
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.05,
                ease: "back.out(1.2)",
                scrollTrigger: {
                    trigger: ".bento-grid",
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                }
            }
        );
    }, { scope: containerRef });

    const openModal = (dept: typeof DEPARTMENTS[0]) => {
        setSelectedDept(dept);
    };

    const closeModal = () => {
        setSelectedDept(null);
    };

    return (
        <section className="relative w-full py-24 bg-background z-10" id="events" ref={containerRef}>
            <div className="container mx-auto px-4 lg:px-8 max-w-[90rem] flex flex-col gap-12">
                <div className="mb-8 flex flex-col md:flex-row items-end justify-between gap-6 dept-header">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full opacity-50" />
                        <h2 className="relative z-10 text-5xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tighter drop-shadow-sm uppercase">
                            Department <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300 italic font-serif tracking-normal">Events</span>
                        </h2>
                        <p className="text-muted-foreground mt-6 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                            Select a department to explore technical symposia, non-technical challenges, and project expos tailored for you.
                        </p>
                    </div>
                </div>

                <div className="bento-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px]">
                    {DEPARTMENTS.map((dept, index) => {
                        const isLarge = index === 2 || index === 5;
                        const isWide = index === 0 || index === 1 || index === 8 || index === 9;

                        return (
                            <div
                                key={dept.id}
                                onClick={() => openModal(dept)}
                                className={`
                                    bento-item group relative overflow-hidden rounded-[2rem] cursor-pointer border border-border/30 bg-card/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2
                                    ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}
                                    ${isWide && !isLarge ? 'md:col-span-2' : ''}
                                `}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-60 transition-opacity duration-700 ${dept.color}`}></div>
                                <div className={`absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700`}></div>

                                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                                    <div className="flex justify-between items-start">
                                        <div className={`text-6xl sm:text-7xl font-black opacity-20 group-hover:opacity-40 transition-opacity duration-500 tracking-tighter ${dept.accent}`}>
                                            0{index + 1}
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-background/50 backdrop-blur-xl border border-white/10 shadow-lg flex items-center justify-center -translate-y-4 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out">
                                            <ArrowRight className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                    </div>

                                    <div className="transform group-hover:-translate-y-2 transition-transform duration-500 ease-out">
                                        <h3 className={`text-3xl sm:text-4xl font-black tracking-tight text-foreground/90 group-hover:text-white transition-colors duration-500`}>
                                            {dept.department}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                                            <span className="w-6 h-0.5 bg-primary rounded-full"></span>
                                            <p className="text-primary font-bold text-sm tracking-widest uppercase">
                                                Explore Events
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedDept && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    style={{ backdropFilter: 'blur(10px)' }}
                    onTouchMove={(e) => e.stopPropagation()}
                    onWheel={(e) => e.stopPropagation()}
                >
                    {/* Background Overlay - clicking closes modal */}
                    <div className="absolute inset-0 bg-background/80" onClick={closeModal}></div>

                    {/* Modal Container */}
                    <div className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
                        {/* Header Color Bar */}
                        <div className={`h-3 w-full bg-gradient-to-r ${selectedDept.color} opacity-80 shrink-0`}></div>

                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-6 right-6 p-2 rounded-full bg-background/70 hover:bg-muted text-foreground transition-colors z-[110] shadow-md backdrop-blur-md"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 sm:p-10" style={{ WebkitOverflowScrolling: 'touch' }}>
                            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-2 tracking-tight pr-8">
                                {selectedDept.department}
                            </h2>
                            {selectedDept.note && (
                                <span className="inline-block text-xs sm:text-sm font-bold tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-8">
                                    {selectedDept.note}
                                </span>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mt-6 sm:mt-8">
                                {/* Left Side: Paper Topics */}
                                {selectedDept.paper_topics && (
                                    <div className="space-y-4">
                                        <h4 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-3">
                                            <span className="w-6 h-[2px] bg-primary"></span>
                                            Paper Presentations
                                        </h4>
                                        <ul className="space-y-3">
                                            {selectedDept.paper_topics.map((topic, i) => (
                                                <li key={i} className="flex items-start gap-3 bg-background/50 border border-border/20 p-4 rounded-xl hover:border-primary/30 transition-colors">
                                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_10px_rgba(255,196,0,0.5)]"></div>
                                                    <span className="text-muted-foreground leading-snug">{topic}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Right Side: Events Grid */}
                                <div className="space-y-6">
                                    {selectedDept.technical && (
                                        <div className="border border-border/50 rounded-2xl p-5 bg-background/40 backdrop-blur-sm hover:border-primary/30 transition-colors">
                                            <h4 className={`text-xs sm:text-sm tracking-widest uppercase font-bold mb-3 ${selectedDept.accent}`}>Technical Events</h4>
                                            <ul className="space-y-2">
                                                {selectedDept.technical.map((e, i) => <li key={i} className="text-foreground tracking-wide font-medium">{e}</li>)}
                                            </ul>
                                        </div>
                                    )}

                                    {selectedDept.non_technical && (
                                        <div className="border border-border/50 rounded-2xl p-5 bg-background/40 backdrop-blur-sm hover:border-primary/30 transition-colors">
                                            <h4 className={`text-xs sm:text-sm tracking-widest uppercase font-bold mb-3 ${selectedDept.accent}`}>Non-Technical Events</h4>
                                            <ul className="space-y-2">
                                                {selectedDept.non_technical.map((e, i) => <li key={i} className="text-foreground tracking-wide font-medium">{e}</li>)}
                                            </ul>
                                        </div>
                                    )}

                                    {selectedDept.project_expo && (
                                        <div className="border border-border/50 rounded-2xl p-5 bg-background/40 backdrop-blur-sm hover:border-primary/30 transition-colors">
                                            <h4 className={`text-xs sm:text-sm tracking-widest uppercase font-bold mb-3 ${selectedDept.accent}`}>Project Expo</h4>
                                            <ul className="space-y-2">
                                                {selectedDept.project_expo.map((e, i) => <li key={i} className="text-foreground tracking-wide font-medium">{e}</li>)}
                                            </ul>
                                        </div>
                                    )}

                                    {selectedDept.other_events && (
                                        <div className="border border-border/50 rounded-2xl p-5 bg-background/40 backdrop-blur-sm hover:border-primary/30 transition-colors">
                                            <h4 className={`text-xs sm:text-sm tracking-widest uppercase font-bold mb-3 ${selectedDept.accent}`}>Other Events</h4>
                                            <ul className="space-y-2">
                                                {selectedDept.other_events.map((e, i) => <li key={i} className="text-foreground tracking-wide font-medium">{e}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Contact & Action */}
                            <div className="mt-12 pt-6 border-t border-border/40 pb-2">
                                <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
                                    {/* Faculty Coordinator */}
                                    <div className="flex-1 bg-background/50 border border-border/20 rounded-2xl p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Faculty Coordinator</p>
                                        <p className="text-xs sm:text-sm font-medium text-foreground">{selectedDept.contact}</p>
                                    </div>
                                    {/* Student Coordinator */}
                                    {selectedDept.student_coordinator && (
                                        <div className="flex-1 bg-primary/5 border border-primary/20 rounded-2xl p-4">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1.5">Student Coordinator</p>
                                            <p className="text-sm font-bold text-foreground">{selectedDept.student_coordinator.name}</p>
                                            <a
                                                href={`tel:${selectedDept.student_coordinator.phone.replace(/\s/g, "")}`}
                                                className="text-xs text-primary/80 hover:text-primary transition-colors font-medium mt-0.5 block"
                                            >
                                                📞 {selectedDept.student_coordinator.phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        closeModal();
                                        router.push(`/register?dept=${selectedDept.id}`);
                                    }}
                                    className="w-full bg-primary text-primary-foreground font-bold px-8 py-4 rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-[0_4px_30px_rgba(255,196,0,0.3)] text-sm sm:text-base"
                                >
                                    Register for {selectedDept.id.toUpperCase()}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </section>
    );
}
