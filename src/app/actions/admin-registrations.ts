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

export async function getRegistrations() {
    const payload = await getAuthenticatedAdmin();
    const department = payload.department as string;

    let query = supabase
        .from("registrations")
        .select("*, team_members(*)")
        .order("id", { ascending: false });

    if (department !== "ALL") {
        query = query.eq('department', department);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching registrations:", error);
        throw new Error("Failed to fetch registrations: " + error.message);
    }

    return { data, userDept: department };
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

