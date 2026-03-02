"use client";

import { useEffect, useState } from "react";
import { updateRegistration, deleteRegistration, getTeamMembers } from "@/app/actions/admin-registrations";
import { X, Check, Save, Trash2, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";

const formatDate = (dateStr: string) => {
    try {
        if (!dateStr) return "N/A";
        return format(new Date(dateStr), "MMM d, hh:mm a");
    } catch {
        return dateStr;
    }
};

export default function RegistrationModal({ isOpen, onClose, registration, onUpdate, onDelete }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editData, setEditData] = useState({
        leader_name: registration?.leader_name,
        leader_email: registration?.leader_email,
        leader_mobile: registration?.leader_mobile,
        college_name: registration?.college_name,
        department: registration?.department,
        event_type: registration?.event_type
    });
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [isLoadingTeam, setIsLoadingTeam] = useState(false);

    useEffect(() => {
        if (isOpen && registration && registration.registration_type === "team") {
            setIsLoadingTeam(true);
            getTeamMembers(registration.id).then(({ data }) => {
                setTeamMembers(data || []);
                setIsLoadingTeam(false);
            });
        }
    }, [isOpen, registration]);

    if (!isOpen || !registration) return null;

    const handleSave = async () => {
        setIsLoading(true);
        const res = await updateRegistration(registration.id, editData);
        if (res.error) {
            toast.error("Failed to update: " + res.error);
        } else {
            toast.success("Updated successfully");
            onUpdate({ ...registration, ...editData });
            setIsEditing(false);
        }
        setIsLoading(false);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this registration? This will also delete all associated team members.")) return;

        setIsLoading(true);
        const res = await deleteRegistration(registration.id);
        if (res.error) {
            toast.error("Failed to delete: " + res.error);
        } else {
            toast.success("Deleted successfully");
            onDelete(registration.id);
        }
        setIsLoading(false);
    };

    const expectedPayment = registration.registration_type === "team" ? 200 * (1 + teamMembers.length) : 200;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <div className="bg-card/95 w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl border border-border/50 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="shrink-0 bg-background/50 backdrop-blur-xl p-6 border-b border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300">Registration Details</h2>
                        <p className="text-sm font-medium text-muted-foreground mt-1 tracking-wide uppercase">ID: {registration.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isEditing ? (
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="border-primary/30 hover:bg-primary/10">
                                <Edit className="w-4 h-4 mr-2 text-primary" /> Edit
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        )}
                        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                        <button onClick={onClose} className="p-2 ml-1 text-muted-foreground hover:bg-card hover:text-foreground rounded-full transition-colors border border-transparent hover:border-border/50">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto flex-1 p-6 relative">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(255,196,0,0.03),transparent_50%)]" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                        {/* Left Column: Participant & Event Info */}
                        <div className="lg:col-span-7 space-y-8">

                            {/* Participant Section */}
                            <div className="bg-background/40 backdrop-blur-sm rounded-xl p-6 border border-border/30 shadow-inner">
                                <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-primary rounded-full"></span> Participant Info
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="col-span-1 sm:col-span-2">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Leader / Individual Name</Label>
                                        {isEditing ? (
                                            <Input value={editData.leader_name} onChange={e => setEditData({ ...editData, leader_name: e.target.value })} className="mt-1.5 bg-background border-border" />
                                        ) : (
                                            <p className="font-semibold text-lg text-foreground mt-0.5">{registration.leader_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Email Address</Label>
                                        {isEditing ? (
                                            <Input value={editData.leader_email} onChange={e => setEditData({ ...editData, leader_email: e.target.value })} className="mt-1.5 bg-background border-border" />
                                        ) : (
                                            <p className="font-medium text-foreground mt-0.5 break-all">{registration.leader_email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Mobile Number</Label>
                                        {isEditing ? (
                                            <Input value={editData.leader_mobile} onChange={e => setEditData({ ...editData, leader_mobile: e.target.value })} className="mt-1.5 bg-background border-border" />
                                        ) : (
                                            <p className="font-medium text-foreground mt-0.5">{registration.leader_mobile}</p>
                                        )}
                                    </div>

                                    <div className="col-span-1 sm:col-span-2">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">College</Label>
                                        {isEditing ? (
                                            <Input value={editData.college_name} onChange={e => setEditData({ ...editData, college_name: e.target.value })} className="mt-1.5 bg-background border-border" />
                                        ) : (
                                            <p className="font-medium text-foreground mt-0.5">{registration.college_name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Event Details Section */}
                            <div className="bg-background/40 backdrop-blur-sm rounded-xl p-6 border border-border/30 shadow-inner">
                                <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span> Event Details
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Department</Label>
                                        {isEditing ? (
                                            <Input value={editData.department} onChange={e => setEditData({ ...editData, department: e.target.value })} className="mt-1.5 bg-background border-border" />
                                        ) : (
                                            <div className="mt-1.5 inline-flex items-center px-3 py-1 rounded-md text-sm font-bold bg-primary/20 text-primary border border-primary/20">
                                                {registration.department}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Event Type</Label>
                                        {isEditing ? (
                                            <Input value={editData.event_type} onChange={e => setEditData({ ...editData, event_type: e.target.value })} className="mt-1.5 bg-background border-border" />
                                        ) : (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {registration.event_type?.split(',').map((event: string, i: number) => (
                                                    <span key={i} className="inline-flex px-2 py-1 rounded bg-muted/80 text-foreground text-xs font-semibold border border-border/50">
                                                        {event.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {registration.paper_topic && (
                                        <div className="col-span-1 sm:col-span-2">
                                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Paper Topic</Label>
                                            <p className="font-medium text-foreground mt-0.5 bg-card/50 p-3 rounded-lg border border-border/50">{registration.paper_topic}</p>
                                        </div>
                                    )}

                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Type</Label>
                                        <p className="font-semibold text-foreground capitalize mt-1.5">{registration.registration_type}</p>
                                    </div>

                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Registered At</Label>
                                        <p className="font-medium text-foreground mt-1.5">
                                            {formatDate(registration.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Team Members Section (if Team) */}
                            {registration.registration_type === "team" && (
                                <div className="bg-background/40 backdrop-blur-sm rounded-xl p-6 border border-border/30 shadow-inner">
                                    <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span> Team Members
                                        <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-500 text-xs rounded-full border border-blue-500/20">
                                            {isLoadingTeam ? "..." : teamMembers.length}
                                        </span>
                                    </h3>

                                    {isLoadingTeam ? (
                                        <p className="text-sm text-muted-foreground italic bg-card/50 p-4 rounded-lg text-center border border-dashed border-border/50 animate-pulse">Loading team members...</p>
                                    ) : teamMembers.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {teamMembers.map((member: any) => (
                                                <div key={member.id} className="bg-card/40 rounded-xl p-4 border border-border/50 shadow-sm relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-4xl font-black text-muted-foreground">{member.member_index}</span>
                                                    </div>
                                                    <div className="relative z-10">
                                                        <div className="font-bold text-foreground truncate">{member.member_name}</div>
                                                        <div className="text-sm text-primary mt-0.5">{member.member_mobile}</div>
                                                        <div className="text-xs text-muted-foreground truncate mt-1">{member.member_email}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic bg-card/50 p-4 rounded-lg text-center border border-dashed border-border/50">No additional team members found.</p>
                                    )}
                                </div>
                            )}

                            {isEditing && (
                                <Button className="w-full py-6 text-lg font-bold rounded-xl shadow-lg shadow-primary/20" onClick={handleSave} disabled={isLoading}>
                                    {isLoading ? "Saving..." : <><Save className="w-5 h-5 mr-2" /> Save Changes</>}
                                </Button>
                            )}
                        </div>

                        {/* Right Column: Payment Details */}
                        <div className="lg:col-span-5 h-full">
                            <div className="bg-background/40 backdrop-blur-sm rounded-xl p-6 border border-border/30 shadow-inner h-full flex flex-col">
                                <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2 shrink-0">
                                    <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span> Payment Details
                                </h3>

                                <div className="bg-card/50 rounded-xl p-5 mb-6 border border-border/50 flex align-center justify-between shrink-0">
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Expected Payment</div>
                                        <div className="text-sm text-foreground">₹200 &times; {registration.registration_type === "team" ? (1 + teamMembers.length) : 1} participants</div>
                                    </div>
                                    <div className="text-3xl font-black text-amber-500">₹{expectedPayment}</div>
                                </div>

                                <div className="flex-1 flex flex-col min-h-[300px]">
                                    <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-3 shrink-0">Transaction Screenshot Evidence</div>

                                    {registration.payment_screenshot_url ? (
                                        <div
                                            className="relative flex-1 rounded-xl overflow-hidden border border-border/50 bg-black/40 cursor-zoom-in group"
                                            onClick={() => window.open(registration.payment_screenshot_url, "_blank")}
                                        >
                                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 z-10 flex items-center justify-center pointer-events-none">
                                                <div className="bg-black/60 text-white font-semibold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2">
                                                    <Eye className="w-4 h-4" /> View Full Resolution
                                                </div>
                                            </div>

                                            {/* Using standard img but containing logic correctly. We can use object-contain for full fit or cover depends on preference. */}
                                            <img
                                                src={registration.payment_screenshot_url}
                                                alt="Payment Screenshot"
                                                className="absolute inset-0 w-full h-full object-contain p-2"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-card/30 rounded-xl border border-dashed border-border/50">
                                            <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-4">
                                                <X className="w-8 h-8 opacity-50" />
                                            </div>
                                            <p className="font-medium text-foreground/80">No Evidence Uploaded</p>
                                            <p className="text-sm mt-1 max-w-[250px]">The user did not attach a payment screenshot during registration.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
