"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { AdminAPI } from "@/lib/admin-api";
import { Resource, ResourceCategory } from "@/models/Resource";
import { Loader } from "@/components/ui/Loader";

const CATEGORIES: ResourceCategory[] = [
  "Recorded Courses",
  "Public Speaking",
  "Leadership Communication",
  "PDF Templates",
  "Audio Bundles"
];

export default function AdminProducts() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "PDF Templates" as ResourceCategory,
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await AdminAPI.getResources();
      setResources(data);
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch resources", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
  };

  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return showToast("Please select a file to upload", "error");

    try {
      setIsSubmitting(true);

      // 1. Upload File to Cloudinary
      showToast("Uploading file to Cloudinary...", "success");
      const uploadRes = await AdminAPI.uploadMedia(file, "mentorleap/resources");
      const fileUrl = uploadRes.url;

      // 2. Create Resource in Firestore
      const resourceData = {
        title: formData.title,
        category: formData.category,
        fileUrl: fileUrl,
      };

      await AdminAPI.createResource(resourceData);

      showToast("Resource uploaded successfully!", "success");
      setIsModalOpen(false);
      setFormData({ title: "", category: "PDF Templates" });
      setFile(null);
      fetchResources();
    } catch (error: any) {
      showToast(error.message || "Failed to upload resource", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Resource & Product Manager</h1>
          <p className="text-[#94a3b8]">Manage PDFs, templates, and audio bundles.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Upload Resource</Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader /></div>
      ) : (
        <Card className="!p-0 overflow-hidden" hoverable={false}>
          {resources.length === 0 ? (
            <div className="p-20 text-center text-[#94a3b8]">No products uploaded yet.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-[#0f172a] text-[#94a3b8] text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4 border-b border-white/10">Title</th>
                  <th className="px-6 py-4 border-b border-white/10">Category</th>
                  <th className="px-6 py-4 border-b border-white/10">File Link</th>
                  <th className="px-6 py-4 border-b border-white/10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {resources.map((res) => (
                  <tr key={res.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 border-b border-white/5 font-semibold text-white">{res.title}</td>
                    <td className="px-6 py-4 border-b border-white/5 text-[#cbd5f5]">{res.category}</td>
                    <td className="px-6 py-4 border-b border-white/5 text-[#00e5ff]">
                      <a href={res.fileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">View File</a>
                    </td>
                    <td className="px-6 py-4 border-b border-white/5 text-right">
                      <button
                        onClick={async () => {
                          if (confirm(`Are you sure you want to permanently delete ${res.title}?`)) {
                            try {
                              const { auth } = await import("@/lib/firebase");
                              const token = await auth.currentUser?.getIdToken();
                              const resDelete = await fetch(`/api/resources?id=${res.id}`, {
                                method: "DELETE",
                                headers: { "Authorization": `Bearer ${token}` }
                              });
                              if (!resDelete.ok) throw new Error("Failed to delete");
                              setResources(resources.filter(r => r.id !== res.id));
                              showToast("Resource deleted successfully", "success");
                            } catch (e) {
                              showToast("Failed to delete resource", "error");
                            }
                          }
                        }}
                        className="text-red-400 hover:text-red-300 text-xs px-2 font-bold uppercase tracking-widest"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {/* UPLOAD MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title="Upload New Resource"
      >
        <form onSubmit={handleUploadResource} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-[#94a3b8] uppercase font-bold tracking-wider">Resource Title</label>
            <Input
              required
              placeholder="e.g. Speaker Contract Template"
              value={formData.title}
              onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#94a3b8] uppercase font-bold tracking-wider">Category</label>
            <select
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00e5ff]"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ResourceCategory })}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-[#020617]">{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#94a3b8] uppercase font-bold tracking-wider">Select File</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="text-xs text-[#cbd5f5] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#00e5ff]/20 file:text-[#00e5ff] hover:file:bg-[#00e5ff]/30 cursor-pointer"
              />
              {file && <span className="text-xs text-green-400">File selected</span>}
            </div>
            <p className="text-[10px] text-[#94a3b8]">Supported: PDF, Doc, MP3, etc. (Max 10MB recommended)</p>
          </div>

          <Button fullWidth className="!mt-6" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload Resource"}
          </Button>
        </form>
      </Modal>

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
