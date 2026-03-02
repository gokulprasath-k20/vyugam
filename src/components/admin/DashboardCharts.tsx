"use client";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9'];

const TOOLTIP_STYLE = {
    backgroundColor: 'rgba(17, 27, 64, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,196,0,0.2)',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
    color: '#fff',
    padding: '12px 16px',
    fontWeight: 600
};

interface ChartData {
    name: string;
    value: number;
}

interface DashboardChartsProps {
    deptData: ChartData[];
    revenueData?: ChartData[];
    eventData: ChartData[];
    userDept?: string;
    totalRevenue?: number;
}

export function DashboardCharts({ deptData, revenueData: propRevenueData, eventData, userDept = "ALL", totalRevenue = 0 }: DashboardChartsProps) {
    const isSingleDept = userDept !== "ALL";
    // Revenue breakdown per department at ₹200 per registration (fallback)
    const fallbackRevenueData = deptData.map(d => ({ name: d.name, value: d.value * 200 }));
    const revenueData = propRevenueData || fallbackRevenueData;

    return (
        <div className="space-y-8 mt-8">
            {/* Row 1: Registrations by Dept + Event Breakdown */}
            <div className={`grid grid-cols-1 ${isSingleDept ? '' : 'lg:grid-cols-2'} gap-8`}>
                {!isSingleDept && (
                    <Card className="bg-card/40 border-border/20 backdrop-blur-xl shadow-lg hover:shadow-primary/5 transition-shadow duration-500">
                        <CardHeader className="border-b border-border/10 pb-4">
                            <CardTitle className="text-lg font-bold tracking-tight">Registrations by Department</CardTitle>
                            <CardDescription className="text-muted-foreground/80">Bar chart showing participation numbers across departments.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={deptData} margin={{ top: 20, right: 30, left: -20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888"
                                            tick={{ fill: '#888', fontSize: 13, fontWeight: 500 }}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            stroke="#888"
                                            tick={{ fill: '#888', fontSize: 13, fontWeight: 500 }}
                                            tickLine={false}
                                            axisLine={false}
                                            allowDecimals={false}
                                            dx={-10}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,196,0,0.05)' }}
                                            contentStyle={TOOLTIP_STYLE}
                                            itemStyle={{ color: '#ffc400' }}
                                        />
                                        <Bar dataKey="value" name="Registrations" radius={[6, 6, 6, 6]} maxBarSize={60}>
                                            {deptData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="bg-card/40 border-border/20 backdrop-blur-xl shadow-lg hover:shadow-primary/5 transition-shadow duration-500">
                    <CardHeader className="border-b border-border/10 pb-4">
                        <CardTitle className="text-lg font-bold tracking-tight">Events Breakdown</CardTitle>
                        <CardDescription className="text-muted-foreground/80">Pie chart showing the distribution of events.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center pt-6">
                        <div className="h-[350px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={eventData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={110}
                                        paddingAngle={3}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {eventData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={TOOLTIP_STYLE}
                                        itemStyle={{ color: '#ffc400' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: 500 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Row 2: Revenue by Department (admin-only) */}
            {!isSingleDept && revenueData.length > 0 && (
                <Card className="bg-card/40 border-border/20 backdrop-blur-xl shadow-lg hover:shadow-primary/5 transition-shadow duration-500">
                    <CardHeader className="border-b border-border/10 pb-4">
                        <CardTitle className="text-lg font-bold tracking-tight">Revenue by Department</CardTitle>
                        <CardDescription className="text-muted-foreground/80">
                            Estimated collection at ₹200 per registration &mdash; Total:{" "}
                            <span className="text-primary font-bold">₹{totalRevenue.toLocaleString('en-IN')}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888"
                                        tick={{ fill: '#888', fontSize: 12, fontWeight: 500 }}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#888"
                                        tick={{ fill: '#888', fontSize: 12, fontWeight: 500 }}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                        tickFormatter={(v: number) => `₹${v.toLocaleString('en-IN')}`}
                                        dx={-5}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,196,0,0.05)' }}
                                        formatter={(value: number | undefined) => [`₹${(value ?? 0).toLocaleString('en-IN')}`, 'Revenue']}
                                        contentStyle={TOOLTIP_STYLE}
                                        itemStyle={{ color: '#ffc400' }}
                                    />
                                    <Bar dataKey="value" name="Revenue" radius={[6, 6, 6, 6]} maxBarSize={60}>
                                        {revenueData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
