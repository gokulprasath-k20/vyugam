"use server";

import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/lib/auth";

export async function getDashboardStats() {
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken')?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const payload = await verifyJwtToken(token);

    if (!payload) {
        throw new Error("Invalid token");
    }

    const department = payload.department as string;

    let query = supabase.from("registrations").select("id, department, event_type, registration_type");
    let tmQuery = supabase.from("team_members").select("*, registrations!inner(department)", { count: 'exact', head: true });

    if (department !== "ALL") {
        query = query.eq('department', department);
        tmQuery = tmQuery.eq('registrations.department', department);
    }

    const { data: regs, error: regError } = await query;

    if (regError) {
        console.error("Error fetching registrations for stats:", regError);
        throw new Error("Failed to fetch statistics");
    }

    const { count: teamMembersCount, error: tmError } = await tmQuery;

    if (tmError) {
        console.error("Error fetching team members count:", tmError);
    }

    const totalRegistrations = regs.length;

    // Total participants = Total leaders (one per registration) + Total Additional Team Members
    const totalParticipants = totalRegistrations + (teamMembersCount || 0);
    const totalRevenue = totalParticipants * 200;

    const deptCounts: Record<string, number> = {};
    const eventCounts: Record<string, number> = {};

    regs.forEach(reg => {
        deptCounts[reg.department] = (deptCounts[reg.department] || 0) + 1;
        eventCounts[reg.event_type] = (eventCounts[reg.event_type] || 0) + 1;
    });

    const deptData = Object.entries(deptCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    const eventData = Object.entries(eventCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    return {
        totalRegistrations,
        totalRevenue,
        totalParticipants,
        deptData,
        eventData,
        userDept: department
    };
}
