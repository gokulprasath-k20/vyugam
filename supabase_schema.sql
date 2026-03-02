-- ============================================================
-- Vyugam '26 Registration Schema
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Main registrations table ──────────────────────────────────
CREATE TABLE IF NOT EXISTS registrations (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leader_name             VARCHAR(255) NOT NULL,
    leader_email            VARCHAR(255) UNIQUE NOT NULL,
    leader_mobile           VARCHAR(20)  NOT NULL,
    college_name            VARCHAR(255) NOT NULL,
    department              VARCHAR(100) NOT NULL,
    event_type              VARCHAR(100) NOT NULL,
    paper_topic             VARCHAR(255),
    registration_type       VARCHAR(20)  NOT NULL DEFAULT 'individual', -- 'individual' | 'team'
    payment_screenshot_url  TEXT,
    registered_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── Team members table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    member_name     VARCHAR(255) NOT NULL,
    member_email    VARCHAR(255) NOT NULL,
    member_mobile   VARCHAR(20)  NOT NULL,
    member_index    INT NOT NULL   -- 1-based, up to 5
);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon inserts on registrations"
ON registrations FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon inserts on team_members"
ON team_members FOR INSERT TO anon WITH CHECK (true);

-- ── Storage bucket for payment screenshots ────────────────────
-- Run this AFTER creating the bucket named 'payment-screenshots'
-- in Storage > Buckets in Supabase Dashboard (set to public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public uploads to payment-screenshots"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'payment-screenshots');

CREATE POLICY "Allow public reads from payment-screenshots"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'payment-screenshots');
