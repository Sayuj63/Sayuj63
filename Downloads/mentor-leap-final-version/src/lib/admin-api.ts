import { auth } from "./firebase";
import { getIdToken } from "firebase/auth";

/**
 * ADMIN API UTILS
 * Helpers for calling protected API routes.
 */

async function getHeaders(): Promise<Record<string, string>> {
    const user = auth.currentUser;
    if (!user) return {};
    const token = await getIdToken(user);
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

export const AdminAPI = {
    // USERS
    async getUsers() {
        const headers = await getHeaders();
        const res = await fetch("/api/users", { headers });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: "Failed to fetch users" }));
            throw new Error(err.error || "Failed to fetch users");
        }
        return res.json();
    },

    // COURSES
    async getCourses() {
        const headers = await getHeaders();
        const res = await fetch("/api/courses", { headers });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: "Failed to fetch courses" }));
            throw new Error(err.error || "Failed to fetch courses");
        }
        return res.json();
    },

    async createCourse(data: any) {
        const headers = await getHeaders();
        const res = await fetch("/api/courses", {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to create course");
        }
        return res.json();
    },

    async updateCourse(id: string, data: any) {
        const headers = await getHeaders();
        const res = await fetch(`/api/courses/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to update course");
        }
        return res.json();
    },

    async deleteCourse(id: string) {
        const headers = await getHeaders();
        const res = await fetch(`/api/courses/${id}`, {
            method: "DELETE",
            headers,
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to delete course");
        }
        return res.json();
    },

    // CATEGORIES
    async getCategories() {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
    },

    async createCategory(data: any) {
        const headers = await getHeaders();
        const res = await fetch("/api/categories", {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create category");
        return res.json();
    },

    async updateCategory(id: string, data: any) {
        const headers = await getHeaders();
        const res = await fetch(`/api/categories/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update category");
        return res.json();
    },

    async deleteCategory(id: string) {
        const headers = await getHeaders();
        const res = await fetch(`/api/categories/${id}`, {
            method: "DELETE",
            headers,
        });
        if (!res.ok) throw new Error("Failed to delete category");
        return res.json();
    },

    // MEDIA
    async uploadMedia(file: File, folder: string = "mentorleap/general") {
        const user = auth.currentUser;
        if (!user) throw new Error("You must be logged in to upload media");
        const token = await getIdToken(user);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/media", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Media upload failed");
        }
        return res.json();
    },

    // RESOURCES
    async createResource(data: any) {
        const headers = await getHeaders();
        const res = await fetch("/api/resources", {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to create resource");
        }
        return res.json();
    },

    async getResources() {
        const headers = await getHeaders();
        const res = await fetch("/api/resources", { headers });
        if (!res.ok) throw new Error("Failed to fetch resources");
        return res.json();
    },

    // BLOG
    async getBlogPosts() {
        const headers = await getHeaders();
        const res = await fetch("/api/blogs", { headers });
        if (!res.ok) throw new Error("Failed to fetch blog posts");
        return res.json();
    },

    async createBlogPost(data: any) {
        const headers = await getHeaders();
        const res = await fetch("/api/blogs", {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create blog post");
        return res.json();
    },

    async updateBlogPost(id: string, data: any) {
        const headers = await getHeaders();
        const res = await fetch(`/api/blogs/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update blog post");
        return res.json();
    },

    async deleteBlogPost(id: string) {
        const headers = await getHeaders();
        const res = await fetch(`/api/blogs/${id}`, {
            method: "DELETE",
            headers,
        });
        if (!res.ok) throw new Error("Failed to delete blog post");
        return res.json();
    },

    // EVENTS
    async getEvents() {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
    },

    async createEvent(data: any) {
        const headers = await getHeaders();
        const res = await fetch("/api/events", {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create event");
        return res.json();
    },

    async updateEvent(id: string, data: any) {
        const headers = await getHeaders();
        const res = await fetch(`/api/events/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update event");
        return res.json();
    },

    async deleteEvent(id: string) {
        const headers = await getHeaders();
        const res = await fetch(`/api/events/${id}`, {
            method: "DELETE",
            headers,
        });
        if (!res.ok) throw new Error("Failed to delete event");
        return res.json();
    },

    // REVENUE
    async getRevenue(range: "day" | "month" | "year" | "all" = "all") {
        const headers = await getHeaders();
        const res = await fetch(`/api/admin/revenue?range=${range}`, { headers });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: "Failed to fetch revenue" }));
            throw new Error(err.error || "Failed to fetch revenue");
        }
        return res.json();
    },

    // ADMIN STATS
    async getStats() {
        const headers = await getHeaders();
        const res = await fetch("/api/admin/stats", { headers });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: "Failed to fetch stats" }));
            throw new Error(err.error || "Failed to fetch stats");
        }
        return res.json();
    },
};
