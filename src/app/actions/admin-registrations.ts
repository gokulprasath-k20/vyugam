"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

import { cookies } from "next/headers";
import { verifyJwtToken } from "@/lib/auth";

async function getAuthenticatedAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken')?.value;
    if (!token) throw new Error("Unauthorized");
    const payload = await verifyJwtToken(token);
    if (!payload) throw new Error("Invalid token");
    return payload;
}

interface GetRegistrationsParams {
    page?: number;
    pageSize?: number;
    search?: string;
    deptFilter?: string;
}

export async function getRegistrations({ page = 1, pageSize = 50, search = "", deptFilter = "ALL" }: GetRegistrationsParams = {}) {
    const payload = await getAuthenticatedAdmin();
    const adminDept = payload.department as string;

    const departmentToQuery = adminDept !== "ALL" ? adminDept : (deptFilter !== "ALL" ? deptFilter : null);

    let query = supabase
        .from("registrations")
        .select("id, leader_name, leader_email, leader_mobile, college_name, department, event_type, registration_type, created_at", { count: "exact" });

    if (departmentToQuery) {
        query = query.eq('department', departmentToQuery);
    }

    if (search) {
        // Search across multiple columns using OR. Requires text indexing for performance if large.
        query = query.or(`leader_name.ilike.%${search}%,leader_email.ilike.%${search}%,college_name.ilike.%${search}%,leader_mobile.ilike.%${search}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.order("id", { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) {
        console.error("Error fetching registrations:", error);
        throw new Error("Failed to fetch registrations: " + error.message);
    }

    // Also fetch unique departments for the filter dropdown (small separate query)
    let depts: string[] = [];
    if (adminDept === "ALL") {
        const { data: deptData } = await supabase.from("registrations").select("department");
        if (deptData) {
            depts = Array.from(new Set(deptData.map(d => d.department)));
        }
    }

    return {
        data: data || [],
        count: count || 0,
        uniqueDepts: depts,
        userDept: adminDept
    };
}

export async function getTeamMembers(registrationId: string) {
    const payload = await getAuthenticatedAdmin();
    // Verify admin can access this department if needed, but for simplicity we rely on the ID
    const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("registration_id", registrationId)
        .order("member_index", { ascending: true });

    if (error) {
        console.error("Error fetching team members:", error);
        return { data: [] };
    }
    return { data };
}

export async function getRegistrationDetails(id: string) {
    const payload = await getAuthenticatedAdmin();
    const department = payload.department as string;

    let query = supabase
        .from("registrations")
        .select("*")
        .eq("id", id);

    if (department !== "ALL") {
        query = query.eq("department", department);
    }

    const { data, error } = await query.single();
    if (error) {
        console.error("Error fetching registration details:", error);
        return { data: null };
    }
    return { data };
}

export async function updateRegistration(id: string, updates: Record<string, unknown>) {
    // Security: require auth before mutating
    const payload = await getAuthenticatedAdmin();
    const department = payload.department as string;

    // Allowlist only safe update fields to prevent mass-assignment attacks
    const allowedKeys = ["status", "notes"];
    const safeUpdates: Record<string, unknown> = {};
    for (const key of allowedKeys) {
        if (key in updates) safeUpdates[key] = updates[key];
    }

    if (Object.keys(safeUpdates).length === 0) {
        return { error: "No valid fields to update." };
    }

    // Department-scoped writes for non-admin users
    let query = supabase.from("registrations").update(safeUpdates).eq("id", id);
    if (department !== "ALL") {
        query = query.eq("department", department);
    }

    const { error } = await query;

    if (error) {
        console.error("Update error:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/registrations");
    revalidatePath("/admin");
    return { success: true };
}

export async function deleteRegistration(id: string) {
    // Security: require admin role for deletes
    const payload = await getAuthenticatedAdmin();
    if (payload.role !== "admin") {
        return { error: "Only administrators can delete registrations." };
    }

    // Delete team members first to handle FK constraint if DB doesn't cascade
    const { error: tmError } = await supabase
        .from("team_members")
        .delete()
        .eq("registration_id", id);

    if (tmError) {
        console.error("Error deleting team members:", tmError);
    }

    const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting registration:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/registrations");
    revalidatePath("/admin");
    return { success: true };
}

