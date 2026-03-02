import { getRegistrations } from "@/app/actions/admin-registrations";
import { RegistrationsTable } from "@/components/admin/RegistrationsTable";

export const dynamic = "force-dynamic";

export default async function RegistrationsPage() {
    let data = [];
    let userDept = "ALL";
    try {
        const res = await getRegistrations();
        data = res.data;
        userDept = res.userDept;
    } catch (e) {
        return <div className="p-8 text-red-500">Failed to load registrations data.</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <RegistrationsTable initialData={data} userDept={userDept} />
        </div>
    );
}
