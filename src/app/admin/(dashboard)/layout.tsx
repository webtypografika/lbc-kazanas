import { requireAuth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminSidebar username={session.username || "Admin"} />
      <div className="pl-72 min-h-screen">
        <main className="p-10 max-w-7xl">{children}</main>
      </div>
    </div>
  );
}
