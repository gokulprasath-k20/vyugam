"use client";

import { useRef, useTransition, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { registerParticipant } from "@/app/actions/register";
import { Loader2, ArrowRight, ArrowLeft, Users, User, CheckCircle2, Phone, Mail, Upload, X, ShieldCheck, Copy } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ShimmerText from "@/components/ShimmerText";

const QR_IMAGES: Record<string, string> = {
    Civil: "/qr/civil.jpeg",
    EEE: "/qr/eee.jpeg",
    CSE: "/qr/cse.jpeg",
    ECE: "/qr/ece.jpeg",
    IT: "/qr/IT.jpeg",
    AI: "/qr/aids.jpeg",
    MBA: "/qr/mba.jpeg",
    BME: "/qr/bme.jpeg",
    Mech: "/qr/mech.jpeg",
    SH: "/qr/sh.jpeg",
};

// ─── Department data ─────────────────────────────────────────────────────────
const DEPT_DATA: Record<string, {
    label: string;
    paper_topics: string[];
    events: { label: string; value: string }[];
    contact: string;
    payment_contact: string;
    student_coordinator: { name: string; phone: string };
}> = {
    Civil: {
        label: "Civil",
        paper_topics: ["Green Building Design", "Renewable energy Integration", "Smart cities infrastructure", "Sustainable urban Transportation"],
        events: [
            { value: "PaperPresentation", label: "Paper Presentation and Project Expo" },
            { value: "Technical", label: "Technical Event (Quiz)" },
            { value: "NonTechnical", label: "Non-Technical Event (Code Cracking)" },
        ],
        contact: "Mr. T.Senthilkumar | 7695808089 | ce_vyugam26@avsenggcollege.ac.in",
        payment_contact: "Mr. T.Senthilkumar | 7695808089",
        student_coordinator: { name: "R. Sriram", phone: "8300897446" },
    },
    EEE: {
        label: "EEE",
        paper_topics: ["Electrical Vehicles (EVs)", "AI in Power Systems", "Renewable Energy Integration", "Smart Grid"],
        events: [
            { value: "PaperPresentation", label: "Paper Presentation and Project Expo" },
            { value: "Technical", label: "Technical Event (Quiz)" },
            { value: "NonTechnical", label: "Non-Technical Event (Electro Hunt)" },
            { value: "ProjectExpo", label: "Project Expo (Spark Xpo)" },
        ],
        contact: "Mr. N.Navaneethan | 9994953681 | ee_vyugam26@avsenggcollege.ac.in",
        payment_contact: "Mr. N.Navaneethan | 9994953681",
        student_coordinator: { name: "N. Vimal", phone: "6379135402" },
    },
    CSE: {
        label: "CSE",
        paper_topics: ["Serverless Computing", "Generative AI: Beyond ChatGPT", "Brain-Computer Interfaces", "DevSecOps: Security in DevOps"],
        events: [
            { value: "PaperPresentation", label: "Paper Presentation and Project Expo" },
            { value: "Technical", label: "Technical Event (Blind Coding)" },
            { value: "NonTechnical", label: "Non-Technical Event (Logo Puzzle)" },
        ],
        contact: "Mrs. S.Sivaranjani | 8220356140 | cs_vyugam26@avsenggcollege.ac.in",
        payment_contact: "Mrs. S.Sivaranjani | 8220356140",
        student_coordinator: { name: "Gurumoorthi N", phone: "9025830342" },
    },
    ECE: {
        label: "ECE",
        paper_topics: ["6G Technology", "AI in Communication", "2nm Semiconductor Technology", "IoT-based Smart Cities & Agriculture"],
        events: [
            { value: "PaperPresentation", label: "Paper Presentation" },
            { value: "Technical", label: "Technical Event (Quiztron)" },
            { value: "NonTechnical", label: "Non-Technical Event (Ad-Zap)" },
            { value: "ProjectExpo", label: "Project Expo (Electro Xhibit)" },
        ],
        contact: "Mr. M.Rajesh | 8124899799 | ec_vyugam26@avsenggcollege.ac.in",
        payment_contact: "Mr. M.Vasanthakumar | 8883686522",
        student_coordinator: { name: "D. Deepak", phone: "6382916897" },
    },
    IT: {
        label: "IT",
        paper_topics: ["AI & ML Applications", "Quantum Computing - Future of IT", "Chatbots and Virtual Assistants", "Digital Twins Technology"],
        events: [
            { value: "PaperPresentation", label: "Paper Presentation and Project Expo" },
            { value: "Technical", label: "Technical Event (Appathon)" },
            { value: "NonTechnical", label: "Non-Technical Event (Ad-Zap)" },
            { value: "NonTechnical", label: "Non-Technical Event (AI-Memes)" },
        ],
        contact: "Mr. C.Surendarvijay | 9092566376 | it_vyugam26@avsenggcollege.ac.in",
        payment_contact: "Mr. C.Surendarvijay | 9092566376",
        student_coordinator: { name: "K. Gokul Prasath", phone: "6380957425" },
    },
    AI: {
        label: "AI & DS and MCA",
        paper_topics: ["Agentic AI", "Multimodal AI", "Edge AI", "AutoML"],
        events: [
            { value: "PaperPresentation", label: "Paper Presentation and Project Expo" },
            { value: "Technical", label: "Technical Event (Vibe Coding)" },
            { value: "NonTechnical", label: "Non-Technical Event (AI Memes / Ad Mad)" },
        ],
        contact: "Mrs. A.Anandhi | 88259 59510 | ad_vyugam26@avsenggcollege.ac.in",
        payment_contact: "Mrs. A.Anandhi | 8825959510",
        student_coordinator: { name: "S. Thanish", phone: "9043294078" },
    },
    MBA: {
        label: "MBA",
        paper_topics: ["AI in Business", "Digital Marketing", "FinTech, HR Analytics, ESG, etc.."],
        events: [
            { value: "PaperPresentation", label: "Paper Presentation" },
            { value: "BusinessQuiz", label: "Business Quiz" },
            { value: "AdZap", label: "Ad Zap" },
        ],
        contact: "Mr. Anand Ravi | 9361929649 | mba_vyugam26@avsenggcollege.ac.in",
        payment_contact: "Mr. Anand Ravi | 9361929649",
        student_coordinator: { name: "Aswanth Singh", phone: "8300718835" },
    },
    BME: {
        label: "BME",
        paper_topics: ["Advanced Image / Signal Processing", "Brain and Neural Engineering", "Medical devices and IoT", "Robotics and Rehabilitation", "Bio informatics and Genomics", "Emerging and Future Technology in BME"],
        events: [
            { value: "PaperPresentation", label: "Paper Presentation and Project Expo" },
            { value: "Technical", label: "Technical Event (Project Expo / Bio Quiz)" },
            { value: "NonTechnical", label: "Non-Technical Event (Adzap)" },
        ],
        contact: "Mrs. M.Krishnaveni | 6380535965 | bm_vyugam26@avsenggcollege.ac.in",
        payment_contact: "Mrs. M.Krishnaveni | 6380535965",
        student_coordinator: { name: "M. Sunil", phone: "9655161481" },
    },
    Mech: {
        label: "Mechanical",
        paper_topics: ["Green Energy", "AI in Manufacturing", "3D Printing Technology", "CAD/CAM", "Production Engineering", "Thermal Engineering", "Robotics"],
        events: [
            { value: "PaperPresentation", label: "Paper Presentation and Project Expo" },
            { value: "Technical", label: "Technical Event (Quiz)" },
            { value: "NonTechnical", label: "Non-Technical Event (Connection)" },
        ],
        contact: "Mr. K.Radhakrishnan | 9566862454 | me_vyugam26@avsenggcollege.ac.in",
        payment_contact: "Mr. K.Radhakrishnan | 9566862454",
        student_coordinator: { name: "L. Sasi Prakash", phone: "8939356123" },
    },
    SH: {
        label: "Science & Humanities (1st Year)",
        paper_topics: ["Language, Technology & Transformation...", "Real world Applications in Engg Maths", "The Physics of Semiconductors", "Sustainable Materials in Emerging Tech"],
        events: [
            { value: "PaperPresentation", label: "Paper Presentation and Project Expo" },
            { value: "Technical", label: "Technical Event (Quiz)" },
            { value: "NonTechnical", label: "Non-Technical Event (Just a Minute (JAM), Short Film)" },
        ],
        contact: "Mr. P.Sridhar | 9994474479 | sh_vyugam26@avsenggcollege.ac.in",
        payment_contact: "Mr. P.Sridhar | 9994474479",
        student_coordinator: { name: "L. Sasi Prakash", phone: "8939356123" },
    },
};

type TeamMember = { name: string; email: string; mobile: string };

const STEPS = ["Event", "Your Info", "Team", "Payment", "Done"];

function StepIndicator({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex items-center justify-center gap-1 mb-8">
            {STEPS.slice(0, total).map((label, i) => (
                <div key={i} className="flex items-center gap-1">
                    <div className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i < current ? "bg-primary text-primary-foreground" :
                            i === current ? "bg-primary text-primary-foreground ring-4 ring-primary/30 scale-110" :
                                "bg-card/50 text-muted-foreground border border-border/50"
                            }`}>
                            {i < current ? "✓" : i + 1}
                        </div>
                        <span className={`text-[10px] transition-colors ${i === current ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                            {label}
                        </span>
                    </div>
                    {i < total - 1 && (
                        <div className={`h-[2px] w-6 mb-4 transition-colors ${i < current ? "bg-primary" : "bg-border/50"}`} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default function RegistrationForm({ isStandalone = false }: { isStandalone?: boolean }) {
    const [isPending, startTransition] = useTransition();
    const containerRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();

    const deptParam = searchParams.get("dept") ?? "";
    const matchedDept = Object.keys(DEPT_DATA).find(k => k.toLowerCase() === deptParam.toLowerCase()) ?? deptParam;

    // ── Multi-step state ──────────────────────────────────────────────────────
    const [step, setStep] = useState(0);

    // Step 0 — Event
    const [selectedDept, setSelectedDept] = useState(matchedDept);
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [paperTopic, setPaperTopic] = useState("");

    // Step 1 — Leader info
    const [leaderName, setLeaderName] = useState("");
    const [leaderEmail, setLeaderEmail] = useState("");
    const [leaderMobile, setLeaderMobile] = useState("");
    const [college, setCollege] = useState("");

    // Step 2 — Team
    const [regType, setRegType] = useState<"individual" | "team">("individual");
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ name: "", email: "", mobile: "" }]);

    // Step 3 — Payment
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // Step 4 — Done
    const [doneInfo, setDoneInfo] = useState<{ name: string; dept: string } | null>(null);

    const deptData = DEPT_DATA[selectedDept] ?? null;
    const isPaper = selectedEvents.includes("PaperPresentation");

    useEffect(() => {
        if (screenshot) {
            const url = URL.createObjectURL(screenshot);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreview(null);
    }, [screenshot]);

    // ── Validation per step ───────────────────────────────────────────────────
    const canNext = () => {
        if (step === 0) return !!selectedDept && selectedEvents.length > 0 && (!isPaper || !!paperTopic);
        if (step === 1) return !!leaderName && !!leaderEmail && !!leaderMobile && !!college;
        if (step === 2) {
            if (regType === "team") {
                return teamMembers.every(m => m.name && m.email && m.mobile);
            }
            return true;
        }
        return true;
    };

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const updateMember = (idx: number, field: keyof TeamMember, val: string) => {
        setTeamMembers(prev => prev.map((m, i) => i === idx ? { ...m, [field]: val } : m));
    };
    const addMember = () => {
        if (teamMembers.length < 5) setTeamMembers(prev => [...prev, { name: "", email: "", mobile: "" }]);
    };
    const removeMember = (idx: number) => {
        setTeamMembers(prev => prev.filter((_, i) => i !== idx));
    };

    // ── Final submit ──────────────────────────────────────────────────────────
    const handleSubmit = () => {
        startTransition(async () => {
            try {
                const fd = new FormData();
                fd.append("leader_name", leaderName);
                fd.append("leader_email", leaderEmail);
                fd.append("leader_mobile", leaderMobile);
                fd.append("college_name", college);
                fd.append("department", selectedDept);
                fd.append("event_type", selectedEvents.join(", "));
                if (paperTopic) fd.append("paper_topic", paperTopic);
                fd.append("registration_type", regType);
                if (screenshot) fd.append("payment_screenshot", screenshot);

                teamMembers.forEach((m, i) => {
                    fd.append(`member_name_${i + 1}`, m.name);
                    fd.append(`member_email_${i + 1}`, m.email);
                    fd.append(`member_mobile_${i + 1}`, m.mobile);
                });

                const res = await registerParticipant(fd);
                if (res.error) {
                    toast.error("Registration Failed", { description: res.error });
                } else {
                    setDoneInfo({ name: leaderName, dept: selectedDept });
                    setStep(4);
                }
            } catch (error: any) {
                console.error("Registration unhandled error:", error);
                toast.error("Registration Error", { description: error?.message || "An unexpected error occurred. Note that files over 5MB are not allowed." });
            }
        });
    };

    // ── Success screen ────────────────────────────────────────────────────────
    if (step === 4 && doneInfo) {
        const deptInfo = DEPT_DATA[doneInfo.dept];
        const coord = deptInfo?.contact ?? "";
        const parts = coord.split("|").map(p => p.trim());
        const studentCoord = deptInfo?.student_coordinator;
        return (
            <div className="container px-4 z-10 w-full" ref={containerRef}>
                <div className="max-w-xl mx-auto w-full">
                    <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl text-center p-8">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                            <CheckCircle2 className="relative w-20 h-20 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            You&apos;re in, {doneInfo.name.split(" ")[0]}! 🎉
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            Registered for <strong className="text-primary">{deptInfo?.label}</strong> — Vyugam &apos;26
                        </p>

                        {/* Coordinator cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-6">
                            {/* Faculty Coordinator */}
                            <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-primary">Faculty Coordinator</p>
                                <p className="text-base font-bold text-foreground">{parts[0]}</p>
                                {parts[1] && (
                                    <a href={`tel:${parts[1].replace(/\s/g, "")}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                                        <Phone className="w-4 h-4" />{parts[1]}
                                    </a>
                                )}
                                {parts[2] && (
                                    <a href={`mailto:${parts[2]}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors break-all text-sm">
                                        <Mail className="w-4 h-4" />{parts[2]}
                                    </a>
                                )}
                            </div>

                            {/* Student Coordinator */}
                            {studentCoord && (
                                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-2">
                                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Student Coordinator</p>
                                    <p className="text-base font-bold text-foreground">{studentCoord.name}</p>
                                    <a
                                        href={`tel:${studentCoord.phone.replace(/\s/g, "")}`}
                                        className="flex items-center gap-2 text-primary/80 hover:text-primary transition-colors text-sm font-medium"
                                    >
                                        <Phone className="w-4 h-4" />{studentCoord.phone}
                                    </a>
                                </div>
                            )}
                        </div>

                        <Button className="mt-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20" onClick={() => { setStep(0); setDoneInfo(null); }}>
                            Register Another
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    // ── Step content ──────────────────────────────────────────────────────────
    const renderStep = () => {
        switch (step) {
            // ── Step 0: Event selection ──────────────────────────────────────
            case 0:
                return (
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label>Department</Label>
                            <Select value={selectedDept} onValueChange={v => { setSelectedDept(v); setSelectedEvents([]); setPaperTopic(""); }}>
                                <SelectTrigger className="h-12 bg-card/50 border-border/50"><SelectValue placeholder="Choose a department" /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(DEPT_DATA).map(([k, d]) => (
                                        <SelectItem key={k} value={k}>{d.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label>Select Events</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {deptData ? (
                                    deptData.events.map(e => {
                                        const isSelected = selectedEvents.includes(e.value);
                                        return (
                                            <button
                                                key={e.value}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedEvents(prev =>
                                                        prev.includes(e.value)
                                                            ? prev.filter(item => item !== e.value)
                                                            : [...prev, e.value]
                                                    );
                                                    if (e.value === "PaperPresentation" && isSelected) {
                                                        setPaperTopic(""); // Clear topic if deselected
                                                    }
                                                }}
                                                className={`relative flex items-start p-4 rounded-xl border-2 transition-all duration-200 text-left ${isSelected
                                                    ? "border-primary bg-primary/10 shadow-md shadow-primary/5"
                                                    : "border-border/50 bg-card/30 hover:bg-card/50 hover:border-primary/40 text-muted-foreground"
                                                    }`}
                                            >
                                                <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/50"
                                                    }`}>
                                                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                </div>
                                                <div className="ml-3 flex flex-col">
                                                    <span className={`text-sm font-semibold leading-tight ${isSelected ? "text-foreground" : ""}`}>{e.label}</span>
                                                </div>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full p-4 rounded-xl border-2 border-dashed border-border/50 text-center text-muted-foreground bg-card/20 text-sm">
                                        Select a department first to see available events.
                                    </div>
                                )}
                            </div>
                        </div>
                        {isPaper && deptData && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Label>Paper Topic</Label>
                                <Select value={paperTopic} onValueChange={setPaperTopic}>
                                    <SelectTrigger className="h-12 bg-card/50 border-primary/40 border"><SelectValue placeholder="Select your paper topic" /></SelectTrigger>
                                    <SelectContent>
                                        {deptData.paper_topics.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                );

            // ── Step 1: Leader info ─────────────────────────────────────────
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Full Name *</Label>
                            <Input value={leaderName} onChange={e => setLeaderName(e.target.value)} placeholder="Your full name" className="h-12 bg-card/50 border-border/50" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address *</Label>
                            <Input type="email" value={leaderEmail} onChange={e => setLeaderEmail(e.target.value)} placeholder="you@example.com" className="h-12 bg-card/50 border-border/50" />
                        </div>
                        <div className="space-y-2">
                            <Label>Mobile Number *</Label>
                            <Input type="tel" value={leaderMobile} onChange={e => setLeaderMobile(e.target.value)} placeholder="10-digit mobile number" className="h-12 bg-card/50 border-border/50" />
                        </div>
                        <div className="space-y-2">
                            <Label>College Name *</Label>
                            <Input value={college} onChange={e => setCollege(e.target.value)} placeholder="Institution name" className="h-12 bg-card/50 border-border/50" />
                        </div>
                    </div>
                );

            // ── Step 2: Individual / Team ───────────────────────────────────
            case 2:
                return (
                    <div className="space-y-6">
                        {/* Registration type selector */}
                        <div className="grid grid-cols-2 gap-3">
                            {(["individual", "team"] as const).map(type => (
                                <button key={type} type="button"
                                    onClick={() => setRegType(type)}
                                    className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${regType === type
                                        ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                                        : "border-border/50 bg-card/30 text-muted-foreground hover:border-primary/40"
                                        }`}
                                >
                                    {type === "individual" ? <User className="w-8 h-8" /> : <Users className="w-8 h-8" />}
                                    <span className="font-bold capitalize">{type}</span>
                                    <span className="text-xs opacity-70">{type === "individual" ? "Just you" : "2–5 members"}</span>
                                </button>
                            ))}
                        </div>

                        {/* Team members */}
                        {regType === "team" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-foreground">Team Members</p>
                                    <span className="text-xs text-muted-foreground">{teamMembers.length}/5</span>
                                </div>
                                {teamMembers.map((m, i) => (
                                    <div key={i} className="relative bg-card/30 border border-border/40 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Member {i + 1}</span>
                                            {i > 0 && (
                                                <button type="button" onClick={() => removeMember(i)} className="text-muted-foreground hover:text-red-400 transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <Input value={m.name} onChange={e => updateMember(i, "name", e.target.value)} placeholder="Full name" className="h-10 bg-background/50 border-border/50 text-sm" />
                                        <Input type="email" value={m.email} onChange={e => updateMember(i, "email", e.target.value)} placeholder="Email" className="h-10 bg-background/50 border-border/50 text-sm" />
                                        <Input type="tel" value={m.mobile} onChange={e => updateMember(i, "mobile", e.target.value)} placeholder="Mobile" className="h-10 bg-background/50 border-border/50 text-sm" />
                                    </div>
                                ))}
                                {teamMembers.length < 5 && (
                                    <Button type="button" variant="outline" className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/5" onClick={addMember}>
                                        + Add Member ({teamMembers.length}/5)
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                );

            // ── Step 3: Payment ─────────────────────────────────────────────
            case 3:
                const participantCount = regType === "individual" ? 1 : 1 + teamMembers.length;
                const totalFee = participantCount * 200;

                const paymentContactParts = deptData?.payment_contact?.split("|").map(p => p.trim()) || [];
                const staffName = paymentContactParts[0] || "Staff Coordinator";
                const staffPhone = paymentContactParts[1] || "";

                return (
                    <div className="space-y-6">
                        <div className="bg-card/40 border border-primary/20 rounded-2xl p-5 text-center space-y-2">
                            <p className="text-xs uppercase tracking-widest text-primary font-bold">Registration Fee</p>
                            <p className="text-4xl font-black text-foreground">₹{totalFee}</p>
                            <p className="text-sm text-muted-foreground">
                                for {participantCount} participant{participantCount > 1 ? "s" : ""} (₹200 each)
                            </p>
                        </div>

                        <div className="bg-card/20 border border-primary/10 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
                            <div className="text-center space-y-2">
                                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground tracking-tight">Secure Payment Steps</h3>
                                <p className="text-sm text-muted-foreground max-w-sm mx-auto">Follow these instructions carefully to complete your registration payment.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative max-w-3xl mx-auto">
                                {/* Connecting line for desktop */}
                                <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 z-0"></div>

                                {/* Step 1 */}
                                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                    <div className="w-14 h-14 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center shadow-lg text-primary font-black text-xl">1</div>
                                    <div className="space-y-2 w-full">
                                        <h4 className="font-semibold text-foreground">Contact & Copy</h4>
                                        <p className="text-xs text-muted-foreground px-4">Copy the Staff Coordinator's number.</p>

                                        <div className="bg-background rounded-2xl p-4 border border-border/50 shadow-sm mt-3 w-full flex flex-col gap-3 min-h-[110px]">
                                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap" title={staffName}>{staffName}</p>
                                            {staffPhone ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={async () => {
                                                            const sanitizedPhone = staffPhone.replace(/\D/g, '').slice(-10);
                                                            if (navigator.clipboard && window.isSecureContext) {
                                                                try {
                                                                    await navigator.clipboard.writeText(sanitizedPhone);
                                                                    toast.success("Number copied!");
                                                                } catch (err) {
                                                                    toast.error("Failed to copy.");
                                                                }
                                                            } else {
                                                                const textArea = document.createElement("textarea");
                                                                textArea.value = sanitizedPhone;
                                                                textArea.style.position = "absolute";
                                                                textArea.style.left = "-999999px";
                                                                document.body.prepend(textArea);
                                                                textArea.select();
                                                                try {
                                                                    document.execCommand('copy');
                                                                    toast.success("Number copied!");
                                                                } catch (error) {
                                                                    toast.error("Failed to copy.");
                                                                } finally {
                                                                    textArea.remove();
                                                                }
                                                            }
                                                        }}
                                                        className="w-full flex items-center justify-center gap-2 text-primary border border-primary/20 rounded-xl py-2.5 px-3 transition-colors active:scale-95 group mt-auto"
                                                    >
                                                        <span className="font-mono font-bold tracking-wider">{staffPhone.replace(/\D/g, '').slice(-10)}</span>
                                                        <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                    </button>
                                                    {QR_IMAGES[selectedDept] && (
                                                        <div className="flex flex-col items-center justify-center mt-2 p-2 rounded-2xl border border-border/50 w-full">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Scan to Pay</p>
                                                            <div className="bg-white p-2 rounded-xl w-full">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img src={QR_IMAGES[selectedDept]} alt="Payment QR" className="w-full h-auto object-contain rounded-lg" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-xs text-muted-foreground py-2 mt-auto">Not available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                    <div className="w-14 h-14 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center shadow-lg text-primary font-black text-xl">2</div>
                                    <div className="space-y-2 w-full">
                                        <h4 className="font-semibold text-foreground">Make Payment</h4>
                                        <p className="text-sm text-muted-foreground px-2">
                                            Open any UPI app and send exactly <strong className="text-foreground text-xl font-extrabold tracking-wider text-primary">₹{totalFee}</strong>
                                        </p>
                                        <div className="bg-background/50 rounded-2xl border border-border/50 shadow-sm mt-2 flex items-center justify-center gap-6 h-[110px]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="https://cdn.iconscout.com/icon/free/png-256/free-upi-logo-icon-svg-download-png-1747946.png" alt="UPI" className="h-9 object-contain brightness-0 dark:brightness-100 dark:invert opacity-70" />
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/320px-Google_Pay_Logo.svg.png" alt="GPay" className="h-7 object-contain" />
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="https://cdn.iconscout.com/icon/free/png-256/free-paytm-226448.png" alt="Paytm" className="h-9 object-contain" />
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                    <div className="w-14 h-14 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center shadow-lg text-primary font-black text-xl">3</div>
                                    <div className="space-y-2 w-full">
                                        <h4 className="font-semibold text-foreground">Upload Proof</h4>
                                        <p className="text-xs text-muted-foreground px-2">
                                            Take a screenshot of the successful transaction and upload it below.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Upload Payment Screenshot *</Label>
                            <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${preview ? "border-primary/50 bg-primary/5" : "border-border/50 bg-card/20 hover:bg-card/40 hover:border-primary/30"
                                }`}>
                                {preview ? (
                                    <div className="relative w-full h-full">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={preview} alt="Payment screenshot" className="w-full h-full object-contain rounded-2xl p-1" />
                                        <button type="button"
                                            className="absolute top-2 right-2 bg-background/80 rounded-full p-1 text-muted-foreground hover:text-red-400"
                                            onClick={e => { e.preventDefault(); setScreenshot(null); }}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Upload className="w-8 h-8" />
                                        <p className="text-sm">Click to upload screenshot</p>
                                        <p className="text-xs opacity-60">PNG, JPG, WEBP — max 5MB</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={e => {
                                    const f = e.target.files?.[0];
                                    if (f && f.size <= 5 * 1024 * 1024) setScreenshot(f);
                                    else if (f) toast.error("File too large", { description: "Max file size is 5MB" });
                                }} />
                            </label>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const content = (
        <div className="container px-4 z-10 w-full" ref={containerRef}>
            <div className="max-w-xl mx-auto w-full">
                <Card className={`border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl ${isStandalone ? "w-full" : ""}`}>
                    <CardHeader className="text-center space-y-2 pb-4">
                        <CardTitle className="text-4xl font-bold tracking-tight text-foreground">
                            Join <ShimmerText text="Vyugam '26" className="italic font-serif" />
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                            Secure your spot at the biggest national technical symposium.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <StepIndicator current={step} total={5} />
                        {renderStep()}
                        <div className="flex gap-3 pt-2">
                            {step > 0 && step < 4 && (
                                <Button variant="outline" className="flex-1 h-12 border-border/50" onClick={handleBack} disabled={isPending}>
                                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                                </Button>
                            )}
                            {step < 3 ? (
                                <Button className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" onClick={handleNext} disabled={!canNext()}>
                                    Next <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            ) : step === 3 ? (
                                <Button className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" onClick={handleSubmit} disabled={isPending || !screenshot}>
                                    {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : "Submit Registration"}
                                </Button>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    if (isStandalone) return <div className="w-full">{content}</div>;

    return (
        <section id="register" className="w-full py-24 bg-card/10 relative overflow-hidden flex justify-center border-t border-border/30">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            {content}
        </section>
    );
}
