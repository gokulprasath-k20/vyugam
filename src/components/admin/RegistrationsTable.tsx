"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Search, Filter } from "lucide-react";
import RegistrationModal from "@/components/admin/RegistrationModal";

// Helper to format date safely
const formatDate = (dateStr: string) => {
    try {
        return format(new Date(dateStr), "MMM d, hh:mm a");
    } catch {
        return dateStr;
    }
};

export function RegistrationsTable({ initialData, userDept = "ALL" }: { initialData: any[], userDept?: string }) {
    const [data, setData] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState("");
    const [deptFilter, setDeptFilter] = useState("ALL");
    const [selectedReg, setSelectedReg] = useState<any | null>(null);

    const isSingleDept = userDept !== "ALL";

    // Filter logic
    const filteredData = data.filter(reg => {
        const matchesSearch =
            reg.leader_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.leader_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.college_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.leader_mobile.includes(searchTerm);

        const matchesDept = isSingleDept ? true : (deptFilter === "ALL" || reg.department === deptFilter);

        return matchesSearch && matchesDept;
    });

    const uniqueDepts = Array.from(new Set(data.map(d => d.department)));

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/40 backdrop-blur-xl p-5 rounded-2xl border border-border/40 shadow-sm">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                    <Input
                        placeholder="Search name, email, college..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background/50 border-border/40 h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50 transition-shadow"
                    />
                </div>
                {!isSingleDept && (
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <Select value={deptFilter} onValueChange={setDeptFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] h-11 bg-background/50 border-border/40 rounded-xl focus:ring-1 focus:ring-primary/50">
                                <SelectValue placeholder="All Departments" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/50">
                                <SelectItem value="ALL" className="rounded-lg cursor-pointer">All Departments</SelectItem>
                                {uniqueDepts.map(dept => (
                                    <SelectItem key={dept} value={dept} className="rounded-lg cursor-pointer">{dept}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-card/40 backdrop-blur-xl rounded-2xl border border-border/40 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="text-xs uppercase bg-background/50 text-muted-foreground tracking-wider font-semibold border-b border-border/40">
                            <tr>
                                <th className="px-6 py-5">Leader / College</th>
                                <th className="px-6 py-5">Contact</th>
                                <th className="px-6 py-5">Department / Event</th>
                                <th className="px-6 py-5">Type</th>
                                <th className="px-6 py-5">Date</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {filteredData.length > 0 ? filteredData.map((reg) => (
                                <tr key={reg.id} className="hover:bg-primary/5 transition-colors duration-200 group">
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-foreground group-hover:text-primary transition-colors">{reg.leader_name}</div>
                                        <div className="text-xs text-muted-foreground truncate max-w-[200px] mt-0.5">{reg.college_name}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-foreground font-medium">{reg.leader_mobile}</div>
                                        <div className="text-xs text-muted-foreground break-all max-w-[200px] mt-0.5">{reg.leader_email}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5 shadow-sm">
                                            {reg.department}
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {reg.event_type?.split(',').map((event: string, i: number) => (
                                                <span key={i} className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-foreground border border-border/50 truncate max-w-[150px]">
                                                    {event.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${reg.registration_type === 'team'
                                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            }`}>
                                            {reg.registration_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-muted-foreground font-medium">
                                        {formatDate(reg.created_at)}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => setSelectedReg(reg)}
                                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-background hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-300 border border-border/40 hover:border-transparent hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Search className="w-10 h-10 mb-4 opacity-20" />
                                            <p className="text-lg font-medium text-foreground/80">No registrations found</p>
                                            <p className="text-sm mt-1">Try adjusting your search criteria or filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-sm text-muted-foreground px-1">
                Showing {filteredData.length} of {data.length} total registrations
            </div>

            {selectedReg && (
                <RegistrationModal
                    isOpen={!!selectedReg}
                    onClose={() => setSelectedReg(null)}
                    registration={selectedReg}
                    onUpdate={(updatedData: any) => {
                        setData(data.map(d => d.id === updatedData.id ? updatedData : d));
                        setSelectedReg(updatedData);
                    }}
                    onDelete={(id: string) => {
                        setData(data.filter(d => d.id !== id));
                        setSelectedReg(null);
                    }}
                />
            )}
        </div>
    );
}
