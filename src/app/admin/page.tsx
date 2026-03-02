import { getDashboardStats } from "@/app/actions/admin";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, IndianRupee } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    let stats;
    try {
        stats = await getDashboardStats();
    } catch (e) {
        return <div className="p-8 text-red-500">Failed to load statistics.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="group bg-gradient-to-br from-card/60 to-background/40 border-border/20 backdrop-blur-xl shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                        <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                            Total Registrations
                        </CardTitle>
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-4xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300">
                            {stats.totalRegistrations}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Individual & Team entries
                        </p>
                    </CardContent>
                </Card>

                <Card className="group bg-gradient-to-br from-card/60 to-background/40 border-border/20 backdrop-blur-xl shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/20 transition-all duration-500 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                        <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                            Total Participants
                        </CardTitle>
                        <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <UserPlus className="w-5 h-5 text-emerald-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-4xl font-black tracking-tighter text-foreground group-hover:text-emerald-500 transition-colors duration-300">
                            {stats.totalParticipants}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            Including team members
                        </p>
                    </CardContent>
                </Card>

                <Card className="group bg-gradient-to-br from-card/60 to-background/40 border-border/20 backdrop-blur-xl shadow-lg hover:shadow-amber-500/5 hover:border-amber-500/20 transition-all duration-500 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                        <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                            Expected Revenue
                        </CardTitle>
                        <div className="p-2 bg-amber-500/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <IndianRupee className="w-5 h-5 text-amber-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-4xl font-black tracking-tighter text-foreground group-hover:text-amber-500 transition-colors duration-300">
                            ₹{stats.totalRevenue.toLocaleString()}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                            Based on ₹200 per entry
                        </p>
                    </CardContent>
                </Card>
            </div>

            <DashboardCharts deptData={stats.deptData} revenueData={stats.revenueData} eventData={stats.eventData} userDept={stats.userDept} totalRevenue={stats.totalRevenue} />
        </div>
    );
}
