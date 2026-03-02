import { getRegistrations } from "@/app/actions/admin-registrations";
import { RegistrationsTable } from "@/components/admin/RegistrationsTable";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function RegistrationsPage() {
    let data = [];
    let count = 0;
    let depts: string[] = [];
    let userDept = "ALL";
    try {
        const res = await getRegistrations({ page: 1, pageSize: 50 });
        data = res.data;
        count = res.count;
        depts = res.uniqueDepts;
        userDept = res.userDept;
    } catch (e) {
        return <div className="p-8 text-red-500">Failed to load registrations data.</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <RegistrationsTable
                initialData={data}
                initialCount={count}
                initialDepts={depts}
                userDept={userDept}
            />
        </div>
    );
}
