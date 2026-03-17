"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { AdminAPI } from "@/lib/admin-api";
import { Course } from "@/models/Course";
import { Loader } from "@/components/ui/Loader";
import { Edit2, Trash2, History as HistoryIcon } from "lucide-react";

const difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"];
const statuses = ["draft", "published", "archived"];

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyTarget, setHistoryTarget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    instructor: "Mridu Bhandari",
    price: 0,
    category: "",
    difficulty: "Beginner",
    duration: "10 Hours",
    status: "published"
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [coursesData, categoriesData] = await Promise.all([
        AdminAPI.getCourses(),
        AdminAPI.getCategories()
      ]);
      setCourses(coursesData);
      setDbCategories(categoriesData);
      if (categoriesData.length > 0) {
        setFormData((prev: any) => ({ ...prev, category: categoriesData[0].name }));
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch curriculum data", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (id: string, title: string) => {
    try {
      setHistoryTarget(title);
      setHistoryData([]);
      setIsHistoryModalOpen(true);
      const { auth } = await import("@/lib/firebase");
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/revisions?id=${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setHistoryData(data);
    } catch (e) {
      console.error(e);
      showToast("Failed to fetch history", "error");
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnail) return showToast("Please upload a thumbnail", "error");

    try {
      setIsSubmitting(true);
      showToast("Uploading thumbnail...", "success");
      const uploadRes = await AdminAPI.uploadMedia(thumbnail, "mentorleap/courses");
      const thumbnailUrl = uploadRes.url;

      const courseData = {
        ...formData,
        thumbnail: thumbnailUrl,
        modules: [],
      };

      await AdminAPI.createCourse(courseData);
      showToast("Course created successfully!", "success");
      setIsModalOpen(false);
      resetForm();
      fetchInitialData();
    } catch (error: any) {
      showToast(error.message || "Failed to create course", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    try {
      setIsSubmitting(true);
      let thumbnailUrl = editingCourse.thumbnail;

      if (thumbnail) {
        showToast("Uploading new thumbnail...", "success");
        const uploadRes = await AdminAPI.uploadMedia(thumbnail, "mentorleap/courses");
        thumbnailUrl = uploadRes.url;
      }

      const updateData = {
        ...formData,
        thumbnail: thumbnailUrl
      };

      await AdminAPI.updateCourse(editingCourse.id!, updateData);
      showToast("Course updated successfully!", "success");
      setIsEditModalOpen(false);
      fetchInitialData();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (!confirm(`Permanently delete ${title}?`)) return;
    try {
      await AdminAPI.deleteCourse(id);
      setCourses(courses.filter(c => c.id !== id));
      showToast("Course deleted", "success");
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      instructor: "Mridu Bhandari",
      price: 0,
      category: dbCategories[0]?.name || "",
      difficulty: "Beginner",
      duration: "10 Hours",
      status: "published"
    });
    setThumbnail(null);
    setEditingCourse(null);
  };

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      price: course.price,
      category: course.category,
      difficulty: course.difficulty || "Beginner",
      duration: course.duration || "10 Hours",
      status: course.status || "published"
    });
    setIsEditModalOpen(true);
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || c.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black mb-2">Curriculum Control</h1>
          <p className="text-[#94a3b8] text-sm uppercase font-bold tracking-widest">{courses.length} Courses across {dbCategories.length} Professional Categories</p>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <select
              className="bg-transparent text-xs text-[#cbd5f5] px-3 py-2 outline-none"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {dbCategories.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <input
              placeholder="Search database..."
              className="bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-xs text-white outline-none focus:border-[#00e5ff]/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>+ Initialize Course</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader /></div>
      ) : (
        <Card className="!p-0 overflow-hidden bg-white/[0.02] border-white/5 shadow-2xl" hoverable={false}>
          <table className="w-full text-left">
            <thead className="bg-[#0f172a] text-[#475569] text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-8 py-5">Course Detail</th>
                <th className="px-8 py-5">Difficulty</th>
                <th className="px-8 py-5">Market Price</th>
                <th className="px-8 py-5">Lifecycle</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-[#475569] italic font-medium">No results found in current registry.</td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-6 border-b border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#0f172a] border border-white/10 overflow-hidden flex-shrink-0 shadow-inner">
                          {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-all" />}
                        </div>
                        <div>
                          <div className="font-bold text-white text-base leading-tight mb-0.5">{course.title}</div>
                          <div className="text-[10px] text-[#475569] font-bold uppercase tracking-widest">{course.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 border-b border-white/5">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${course.difficulty === 'Expert' ? 'text-red-400 bg-red-400/10' :
                        course.difficulty === 'Advanced' ? 'text-amber-400 bg-amber-400/10' :
                          course.difficulty === 'Intermediate' ? 'text-blue-400 bg-blue-400/10' :
                            'text-green-400 bg-green-400/10'
                        }`}>
                        {course.difficulty || 'Beginner'}
                      </span>
                    </td>
                    <td className="px-8 py-6 border-b border-white/5 font-mono text-[#00e5ff] font-bold">₹{course.price.toLocaleString()}</td>
                    <td className="px-8 py-6 border-b border-white/5">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${course.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        course.status === 'archived' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-white/5 text-[#94a3b8] border-white/10'
                        }`}>
                        {course.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-8 py-6 border-b border-white/5 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button onClick={() => fetchHistory(course.id!, course.title)} className="p-2.5 rounded-xl bg-white/5 text-[#94a3b8] hover:text-[#00e5ff] hover:bg-[#00e5ff]/10 transition-all border border-transparent hover:border-[#00e5ff]/20" title="Revision History">
                          <HistoryIcon size={16} />
                        </button>
                        <button onClick={() => openEdit(course)} className="p-2.5 rounded-xl bg-white/5 text-[#94a3b8] hover:text-[#00e5ff] hover:bg-[#00e5ff]/10 transition-all border border-transparent hover:border-[#00e5ff]/20">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteCourse(course.id!, course.title)} className="p-2.5 rounded-xl bg-white/5 text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      )}

      {/* REVISION HISTORY MODAL */}
      <Modal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} title={`Revision History: ${historyTarget}`}>
        <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {historyData.length === 0 ? (
            <div className="text-center py-10 text-[#475569] italic">No revisions found for this asset.</div>
          ) : (
            historyData.map((rev, i) => (
              <div key={rev.id} className="p-4 rounded-xl bg-white/5 border border-white/5 relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#00e5ff]/10 text-[#00e5ff] flex items-center justify-center text-[10px] font-bold">{historyData.length - i}</div>
                  <div>
                    <div className="text-xs font-bold text-white">System Synchronized</div>
                    <div className="text-[10px] text-[#475569] font-medium">
                      {rev.timestamp ? new Date(rev.timestamp.seconds * 1000).toLocaleString() : 'Just now'}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] bg-black/20 p-2 rounded border border-white/5 text-[#94a3b8] font-mono leading-relaxed">
                  Authorized by Administrator (UID: ...{rev.adminUid?.slice(-6)})
                </div>
              </div>
            ))
          )}
        </div>
        <Button fullWidth className="mt-8" variant="outline" onClick={() => setIsHistoryModalOpen(false)}>Close Archive</Button>
      </Modal>

      {/* CREATE MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title="Initialize New Course">
        <form onSubmit={handleCreateCourse} className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
          <Input label="Course Strategic Title" required value={formData.title} onChange={(e: any) => setFormData({ ...formData, title: e.target.value })} />
          <Textarea label="Executive Curriculum Summary" required value={formData.description} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] text-[#475569] font-black uppercase tracking-widest pl-1">Target Category</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00e5ff]"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {dbCategories.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-[#475569] font-black uppercase tracking-widest pl-1">Difficulty Tier</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00e5ff]"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              >
                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label="Price (INR)" type="number" required value={formData.price} onChange={(e: any) => setFormData({ ...formData, price: parseInt(e.target.value) })} />
            <Input label="Duration" placeholder="e.g. 15 Hours" required value={formData.duration} onChange={(e: any) => setFormData({ ...formData, duration: e.target.value })} />
            <div className="space-y-2">
              <label className="text-[10px] text-[#475569] font-black uppercase tracking-widest pl-1">Status</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00e5ff]"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-[#475569] font-black uppercase tracking-widest pl-1">Course Thumbnail</label>
            <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)} className="w-full text-xs text-[#cbd5f5] file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer" />
          </div>

          <Button fullWidth className="h-14 !mt-8 font-black uppercase tracking-[0.2em]" disabled={isSubmitting}>
            {isSubmitting ? "Processing Asset..." : "Deploy to Curriculum"}
          </Button>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditModalOpen} onClose={() => !isSubmitting && setIsEditModalOpen(false)} title="Update Live Curriculum">
        <form onSubmit={handleUpdateCourse} className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
          <Input label="Update Strategic Title" required value={formData.title} onChange={(e: any) => setFormData({ ...formData, title: e.target.value })} />
          <Textarea label="Update Summary" required value={formData.description} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] text-[#475569] font-black uppercase tracking-widest pl-1">Update Category</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00e5ff]"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {dbCategories.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-[#475569] font-black uppercase tracking-widest pl-1">Difficulty Adjustment</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00e5ff]"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              >
                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label="Update Price" type="number" required value={formData.price} onChange={(e: any) => setFormData({ ...formData, price: parseInt(e.target.value) })} />
            <Input label="Update Duration" required value={formData.duration} onChange={(e: any) => setFormData({ ...formData, duration: e.target.value })} />
            <div className="space-y-2">
              <label className="text-[10px] text-[#475569] font-black uppercase tracking-widest pl-1">Live Status</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00e5ff]"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-[#475569] font-black uppercase tracking-widest pl-1">Update Thumbnail (Optional)</label>
            {editingCourse?.thumbnail && !thumbnail && (
              <div className="mb-2 w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                <img src={editingCourse.thumbnail} alt="Current" className="w-full h-full object-cover" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)} className="w-full text-xs text-[#cbd5f5] file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer" />
          </div>

          <Button fullWidth className="h-14 !mt-8 font-black uppercase tracking-[0.2em]" disabled={isSubmitting}>
            {isSubmitting ? "Synchronizing Changes..." : "Commit Asset Updates"}
          </Button>
        </form>
      </Modal>

      <Toast isVisible={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
