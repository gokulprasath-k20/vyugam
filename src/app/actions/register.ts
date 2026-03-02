"use server";

import { supabase } from "@/lib/supabase";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_MB = 5;
const MAX_INPUT_LENGTH = 500;

function trimAndLimit(val: string | undefined, max = MAX_INPUT_LENGTH): string | undefined {
    if (!val) return val;
    return val.trim().slice(0, max);
}

export async function registerParticipant(formData: FormData) {
    const leader_name = trimAndLimit(formData.get("leader_name")?.toString());
    const leader_email = trimAndLimit(formData.get("leader_email")?.toString(), 254);
    const leader_mobile = trimAndLimit(formData.get("leader_mobile")?.toString(), 15);
    const college_name = trimAndLimit(formData.get("college_name")?.toString(), 200);
    const department = trimAndLimit(formData.get("department")?.toString(), 50);
    const event_type = trimAndLimit(formData.get("event_type")?.toString(), 300);
    const paper_topic = trimAndLimit(formData.get("paper_topic")?.toString(), 300) ?? null;
    const registration_type = trimAndLimit(formData.get("registration_type")?.toString(), 20) ?? "individual";
    const screenshot = formData.get("payment_screenshot") as File | null;

    if (!leader_name || !leader_email || !leader_mobile || !college_name || !department || !event_type) {
        return { error: "All required fields must be filled." };
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leader_email)) {
        return { error: "Please enter a valid email address." };
    }

    // Basic mobile check (10-15 digits)
    if (!/^\d{10,15}$/.test(leader_mobile.replace(/[\s\-+()+]/g, ""))) {
        return { error: "Please enter a valid mobile number." };
    }

    // 1. Validate and upload payment screenshot to Supabase Storage
    let payment_screenshot_url: string | null = null;
    if (screenshot && screenshot.size > 0) {
        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(screenshot.type)) {
            return { error: "Payment screenshot must be an image file (JPG, PNG, WebP, or GIF)." };
        }
        // Validate file size
        if (screenshot.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            return { error: `Payment screenshot must be under ${MAX_FILE_SIZE_MB}MB.` };
        }

        const ext = screenshot.type.split("/")[1] ?? "jpg";
        // Sanitized filename — no path traversal possible
        const safeEmail = leader_email.replace(/[^a-z0-9]/gi, "_").slice(0, 60);
        const fileName = `${Date.now()}_${safeEmail}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from("payment-screenshots")
            .upload(fileName, screenshot, { cacheControl: "3600", upsert: false });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return { error: "Failed to upload payment screenshot. Please try again." };
        }

        const { data: publicUrl } = supabase.storage
            .from("payment-screenshots")
            .getPublicUrl(fileName);
        payment_screenshot_url = publicUrl.publicUrl;
    }

    // 2. Insert main registration
    const { data: reg, error: regError } = await supabase
        .from("registrations")
        .insert([{ leader_name, leader_email, leader_mobile, college_name, department, event_type, paper_topic, registration_type, payment_screenshot_url }])
        .select("id")
        .single();

    if (regError) {
        if (regError.code === "23505") {
            return { error: "This email is already registered for Vyugam '26." };
        }
        console.error("Registration error:", regError);
        return { error: "Registration failed. Please try again." };
    }

    // 3. Insert team members (if team)
    if (registration_type === "team" && reg?.id) {
        const members = [];
        for (let i = 1; i <= 5; i++) {
            const name = trimAndLimit(formData.get(`member_name_${i}`)?.toString());
            const email = trimAndLimit(formData.get(`member_email_${i}`)?.toString(), 254);
            const mobile = trimAndLimit(formData.get(`member_mobile_${i}`)?.toString(), 15);
            if (name && email && mobile) {
                members.push({ registration_id: reg.id, member_name: name, member_email: email, member_mobile: mobile, member_index: i });
            }
        }
        if (members.length > 0) {
            const { error: membersError } = await supabase.from("team_members").insert(members);
            if (membersError) console.error("Team members insert error:", membersError);
        }
    }

    return { success: true, registrationId: reg?.id };
}

