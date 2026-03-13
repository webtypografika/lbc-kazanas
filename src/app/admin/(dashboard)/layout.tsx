import { requireAuth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <AdminSidebar username={session.username || "Admin"} />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
