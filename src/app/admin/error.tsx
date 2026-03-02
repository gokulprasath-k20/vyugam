"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="w-full h-[60vh] flex items-center justify-center p-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 max-w-md text-center space-y-4">
                <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-2 text-destructive">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-destructive">Something went wrong!</h2>
                <p className="text-sm text-muted-foreground">{error.message || "An unexpected error occurred while loading data."}</p>
                <Button
                    variant="outline"
                    className="mt-4 border-destructive/20 text-destructive hover:bg-destructive/10"
                    onClick={() => reset()}
                >
                    <RefreshCcw className="w-4 h-4 mr-2" /> Try again
                </Button>
            </div>
        </div>
    );
}
