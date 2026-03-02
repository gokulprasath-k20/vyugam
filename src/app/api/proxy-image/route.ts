import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
        return new NextResponse("Missing URL parameter", { status: 400 });
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return new NextResponse("Failed to fetch image", { status: response.status });
        }

        const buffer = await response.arrayBuffer();

        const headers = new Headers();
        headers.set("Content-Type", response.headers.get("Content-Type") || "image/jpeg");
        headers.set("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=43200"); // Standard edge caching for 1 day

        return new NextResponse(buffer, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Proxy image error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
