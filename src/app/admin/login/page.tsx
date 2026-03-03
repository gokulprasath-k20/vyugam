"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

const DEPARTMENTS = [
    { value: "Admin", label: "Master Admin" },
    { value: "Civil", label: "Civil Engineering" },
    { value: "CSE", label: "Computer Science & Engineering" },
    { value: "ECE", label: "Electronics & Communication Engineering" },
    { value: "EEE", label: "Electrical & Electronics Engineering" },
    { value: "IT", label: "Information Technology" },
    { value: "AI", label: "AI & DS and MCA" },
    { value: "MBA", label: "Management Studies" },
    { value: "BME", label: "Biomedical Engineering" },
    { value: "Mech", label: "Mechanical Engineering" },
    { value: "SH", label: "Science & Humanities (1st Year)" },
];

export default function AdminLogin() {
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!role) {
            toast.error("Please select a department or role.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role, password }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Login successful");
                router.push("/admin");
                router.refresh();
            } else {
                toast.error(data.error || "Login failed");
            }
        } catch (error) {
            toast.error("An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <Card className="w-full max-w-md border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl z-10">
                <CardHeader className="text-center space-y-2 pb-6">
                    <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">Admin Portal</CardTitle>
                    <CardDescription>Restricted area for Vyugam &apos;26 administrators.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Department / Role</Label>
                            <Select value={role} onValueChange={setRole} required>
                                <SelectTrigger className="h-12 bg-background/50 border-border/50">
                                    <SelectValue placeholder="Select your department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DEPARTMENTS.map(dept => (
                                        <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12 bg-background/50 border-border/50"
                            />
                        </div>
                        <Button type="submit" className="w-full h-12 font-semibold text-primary-foreground" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Authenticate"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
