"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { AdminAPI } from "@/lib/admin-api";
import { User } from "@/models/User";
import { Loader } from "@/components/ui/Loader";
import { Search, Trash2, Mail, Shield, User as UserIcon } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await AdminAPI.getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      setToast({ show: true, message: "Failed to fetch users. Check admin auth.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (uid: string, name: string) => {
    if (!confirm(`Permanently delete account for ${name}? This cannot be undone.`)) return;

    try {
      const { auth } = await import("@/lib/firebase");
      const token = await auth.currentUser?.getIdToken();

      const res = await fetch(`/api/users?uid=${uid}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Delete operation failed");

      setUsers(users.filter(u => u.uid !== uid));
      setToast({ show: true, message: "User account purged successfully", type: "success" });
    } catch (e: any) {
      setToast({ show: true, message: e.message, type: "error" });
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center"><Shield size={18} /></div>
            <h1 className="text-3xl font-black tracking-tight">User Directory</h1>
          </div>
          <p className="text-[#475569] font-bold text-xs uppercase tracking-[0.2em] ml-11">Total Records: {users.length}</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] group-focus-within:text-[#00e5ff] transition-colors" size={16} />
            <input
              placeholder="Search registry..."
              className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-6 py-3 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 focus:bg-white/[0.08] transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-[46px] px-6 border-white/10 hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition-all">Export JSON</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader /></div>
      ) : (
        <Card className="!p-0 overflow-hidden bg-white/[0.02] border-white/5 shadow-2xl" hoverable={false}>
          <table className="w-full text-left">
            <thead className="bg-[#0f172a] text-[#475569] text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-8 py-5">Identity</th>
                <th className="px-8 py-5 text-center">Authentication</th>
                <th className="px-8 py-5 text-center">Permitted Role</th>
                <th className="px-8 py-5 text-right">System Control</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-[#475569] italic font-medium">No records matching search criteria.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-8 py-6 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#94a3b8]">
                          <UserIcon size={18} />
                        </div>
                        <span className="font-bold text-white text-base">{user.name || "Anonymous User"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 border-b border-white/5 text-center">
                      <div className="flex items-center justify-center gap-2 text-[#cbd5f5] font-medium">
                        <Mail size={14} className="text-[#475569]" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-8 py-6 border-b border-white/5 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-white/5 text-[#94a3b8] border-white/10'}`}>
                        {user.role || "Student"}
                      </span>
                    </td>
                    <td className="px-8 py-6 border-b border-white/5 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.uid, user.name || user.email)}
                        className="p-2.5 rounded-xl bg-white/5 text-[#475569] hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      )}

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
