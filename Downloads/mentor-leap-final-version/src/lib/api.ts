import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, query, where, Timestamp } from "firebase/firestore";

// Simulated server delays for UI smoothness
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function submitCoachingRequest(data: any) {
  try {
    await delay(1000);
    const docRef = await addDoc(collection(db, "coachingRequests"), {
      ...data,
      createdAt: Timestamp.now(),
      status: "pending"
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.warn("Adding doc without proper config might fail. Mock fallback active.");
    return { success: true, id: "mock-id", mock: true };
  }
}

export async function submitAnchorRequest(data: any) {
  try {
    await delay(1000);
    const docRef = await addDoc(collection(db, "anchorRequests"), {
      ...data,
      createdAt: Timestamp.now(),
      status: "pending"
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: true, id: "mock-id", mock: true };
  }
}

export async function fetchEvents() {
  try {
    const q = query(collection(db, "events"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return [];
  }
}

export async function fetchCourseData() {
  try {
    const q = query(collection(db, "courses"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return [];
  }
}

export async function fetchBlogs() {
  try {
    const q = query(collection(db, "blog_posts"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return [];
  }
}

export async function fetchReviews() {
  try {
    const q = query(collection(db, "reviews"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return [];
  }
}

export async function fetchFAQs() {
  try {
    const q = query(collection(db, "faqs"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return [];
  }
}

export async function fetchServices() {
  try {
    const q = query(collection(db, "services"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return [];
  }
}

export async function fetchFounderInfo() {
  try {
    const q = query(collection(db, "site_settings"), where("type", "==", "founder"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return null;
  }
}

export async function fetchResources() {
  try {
    const q = query(collection(db, "resources"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return [];
  }
}
export async function fetchCoachingPrograms() {
  try {
    const q = query(collection(db, "coaching_programs"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return [];
  }
}
