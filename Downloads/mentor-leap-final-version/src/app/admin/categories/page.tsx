"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { AdminAPI } from "@/lib/admin-api";
import { Category } from "@/models/Category";
import { Loader } from "@/components/ui/Loader";
import { Edit2, Trash2, Layers } from "lucide-react";

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await AdminAPI.getCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
            showToast("Failed to fetch categories", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ show: true, message, type });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await AdminAPI.createCategory(formData);
            showToast("Category created successfully", "success");
            setIsModalOpen(false);
            setFormData({ name: "", description: "" });
            fetchCategories();
        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;
        try {
            setIsSubmitting(true);
            await AdminAPI.updateCategory(editingCategory.id!, formData);
            showToast("Category updated", "success");
            setIsEditModalOpen(false);
            fetchCategories();
        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete category "${name}"? This may affect courses assigned to it.`)) return;
        try {
            await AdminAPI.deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
            showToast("Category deleted", "success");
        } catch (error: any) {
            showToast(error.message, "error");
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center"><Layers size={18} /></div>
                        <h1 className="text-3xl font-black tracking-tight">Public Speaking Taxonomy</h1>
                    </div>
                    <p className="text-[#475569] font-bold text-xs uppercase tracking-[0.2em] ml-11">Structural Category Management</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>+ Define Category</Button>
            </div>

            {loading ? (
                <div className="flex justify-center p-20"><Loader /></div>
            ) : (
                <Card className="!p-0 overflow-hidden bg-white/[0.02] border-white/5 shadow-2xl" hoverable={false}>
                    <table className="w-full text-left">
                        <thead className="bg-[#0f172a] text-[#475569] text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/5">
                            <tr>
                                <th className="px-8 py-5">Classification Name</th>
                                <th className="px-8 py-5">Scope / Description</th>
                                <th className="px-8 py-5 text-center">Courses</th>
                                <th className="px-8 py-5 text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-white/[0.03] transition-colors border-b border-white/5 last:border-0">
                                    <td className="px-8 py-6">
                                        <span className="font-bold text-white text-base">{cat.name}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-[#94a3b8] text-xs max-w-xs truncate">{cat.description}</p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="font-mono text-[#00e5ff] font-bold">{cat.courseCount || 0}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => { setEditingCategory(cat); setFormData({ name: cat.name, description: cat.description }); setIsEditModalOpen(true); }} className="p-2.5 rounded-xl bg-white/5 text-[#94a3b8] hover:text-[#00e5ff] hover:bg-[#00e5ff]/10 transition-all">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(cat.id!, cat.name)} className="p-2.5 rounded-xl bg-white/5 text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}

            {/* CREATE MODAL */}
            <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title="Define New Taxonomy">
                <form onSubmit={handleCreate} className="space-y-6 pt-4">
                    <Input label="Category Identity" required value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} />
                    <Textarea label="Thematic Scope" required value={formData.description} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} />
                    <Button fullWidth className="h-14 !mt-8 font-black uppercase tracking-[0.2em]" disabled={isSubmitting}>
                        {isSubmitting ? "Deploying..." : "Commit Category"}
                    </Button>
                </form>
            </Modal>

            {/* EDIT MODAL */}
            <Modal isOpen={isEditModalOpen} onClose={() => !isSubmitting && setIsEditModalOpen(false)} title="Modify Taxonomy">
                <form onSubmit={handleUpdate} className="space-y-6 pt-4">
                    <Input label="Category Identity" required value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} />
                    <Textarea label="Thematic Scope" required value={formData.description} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} />
                    <Button fullWidth className="h-14 !mt-8 font-black uppercase tracking-[0.2em]" disabled={isSubmitting}>
                        {isSubmitting ? "Syncing..." : "Update Live Data"}
                    </Button>
                </form>
            </Modal>

            <Toast isVisible={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
}
