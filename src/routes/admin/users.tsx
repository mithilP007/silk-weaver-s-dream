import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Mail, Shield, User, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { dummyUsers as initialUsers } from "@/data/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();
      if (res.success) {
        setUsers(res.data);
      } else {
        throw new Error(res.message || "Failed to load directory.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Offline, loaded mock back-ups.");
      setUsers(initialUsers);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleAdmin = async (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    const newRole = targetUser.role === "admin" ? "customer" : "admin";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update role");
      }

      toast.success(`Role updated successfully`, {
        description: `${targetUser.name} is now a ${newRole}.`,
      });
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error changing user permissions");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[#2c2623] sm:text-3xl">
          Customer & Staff Directory
        </h1>
        <p className="text-sm text-[#6e5d53] mt-1">
          Review customer registrations, activate administrative privileges, and check account statuses.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e8dfd8] bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6e5d53]">Registered Customers</p>
          <p className="font-display text-2xl font-bold text-[#2c2623] mt-2">
            {users.filter((u) => u.role !== "admin").length} Accounts
          </p>
        </div>
        <div className="rounded-2xl border border-[#e8dfd8] bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6e5d53]">Boutique Staff</p>
          <p className="font-display text-2xl font-bold text-primary mt-2">
            {users.filter((u) => u.role === "admin").length} Admins
          </p>
        </div>
        <div className="rounded-2xl border border-[#e8dfd8] bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6e5d53]">Active Sessions</p>
          <p className="font-display text-2xl font-bold text-emerald-600 mt-2">Live Now</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-xl border border-[#e8dfd8] bg-white p-4 shadow-soft">
        <div className="relative flex max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e5d53]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search directory by name, email..."
            className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] py-2.5 pl-10 pr-4 text-sm text-[#2c2623] outline-none focus:border-[#d4af37]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e8dfd8] bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8dfd8] text-[#6e5d53] uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Role / Permissions</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Admin Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede8] font-medium text-[#2c2623]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-[#6e5d53]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-[#3a1d13]" />
                      <span>Fetching staff and user directory...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-[#6e5d53]">
                    No accounts found matching search filters.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-[#fbfaf7]/65 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-[#3a1d13]/10 text-primary font-bold">
                          {u.name.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-snug">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="flex items-center gap-1.5 text-xs text-[#6e5d53]">
                        <Mail size={13} className="text-gold" /> {u.email}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                          u.role === "admin"
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-emerald-50 text-emerald-700",
                        )}
                      >
                        {u.role === "admin" ? <Shield size={10} /> : <User size={10} />}
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">May 2026</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => toggleAdmin(u.id)}
                        className="inline-flex items-center text-[#6e5d53] hover:text-primary shrink-0"
                      >
                        {u.role === "admin" ? (
                          <ToggleRight size={32} className="text-[#d4af37]" />
                        ) : (
                          <ToggleLeft size={32} className="text-muted-foreground" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
