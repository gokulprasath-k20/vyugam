"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, LogOut, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userDept, setUserDept] = useState("A");

    useEffect(() => {
        // Read the actual adminToken cookie if possible (or parse via server in page context)
        // Since we are strictly client-side here and cannot natively decrypt the HttpOnly cookie, 
        // we'll fetch the current session info from a quick API route or rely on local storage context.
        // For visual sake, if we don't have it, we default to "A".
        const checkSession = async () => {
            try {
                const res = await fetch("/api/admin/session");
                if (res.ok) {
                    const data = await res.json();
                    if (data.department) setUserDept(data.department);
                }
            } catch (e) { }
        };
        checkSession();
    }, []);

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-border/30 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300 relative z-10 hover:scale-105 transition-transform origin-left">Vyugam '26</span>
                    <button onClick={closeSidebar} className="md:hidden text-muted-foreground hover:text-foreground transition-colors relative z-10">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" onClick={closeSidebar} className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${pathname === "/admin" ? "bg-primary/10 text-primary font-semibold shadow-inner shadow-primary/5 border border-primary/20" : "text-muted-foreground hover:bg-card/80 hover:text-foreground hover:border-border/50 border border-transparent"}`}>
                        <LayoutDashboard className={`w-5 h-5 transition-transform duration-300 ${pathname === "/admin" ? "" : "group-hover:scale-110"}`} /> Dashboard
                    </Link>
                    <Link href="/admin/registrations" onClick={closeSidebar} className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${pathname.startsWith("/admin/registrations") ? "bg-primary/10 text-primary font-semibold shadow-inner shadow-primary/5 border border-primary/20" : "text-muted-foreground hover:bg-card/80 hover:text-foreground hover:border-border/50 border border-transparent"}`}>
                        <Users className={`w-5 h-5 transition-transform duration-300 ${pathname.startsWith("/admin/registrations") ? "" : "group-hover:scale-110"}`} /> Registrations
                    </Link>
                </nav>
                <div className="p-4 border-t border-border/30">
                    <button onClick={handleLogout} className="group flex items-center gap-3 px-3 py-3 w-full rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 hover:shadow-inner hover:shadow-red-500/10 border border-transparent hover:border-red-500/20">
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen min-w-0 bg-background/50 relative">
                <header className="h-16 shrink-0 flex items-center justify-between px-4 md:px-8 border-b border-border/30 bg-background/60 backdrop-blur-xl sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={toggleSidebar} className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-card/50 rounded-lg">
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold capitalize tracking-tight text-foreground/90 truncate max-w-[200px] sm:max-w-md hidden sm:block">
                            {pathname === "/admin" ? "Overview" : pathname.split('/').pop()}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30 text-primary font-bold text-sm tracking-tighter shadow-inner shadow-primary/20 cursor-default hover:bg-primary/20 transition-colors">
                            {userDept === "ALL" ? "ADM" : userDept.substring(0, 3)}
                        </div>
                    </div>
                </header>

                {/* Scrollable Main Content wrapper correctly bound */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-8 md:p-8 relative scroll-smooth">
                    <div className="max-w-7xl mx-auto w-full pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-2xl font-bold capitalize tracking-tight text-foreground/90 mb-6 sm:hidden">
                            {pathname === "/admin" ? "Overview" : pathname.split('/').pop()}
                        </h1>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
