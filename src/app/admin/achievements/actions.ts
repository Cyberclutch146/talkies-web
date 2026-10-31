"use server";

import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { AchievementItem } from "@/lib/validations/achievement";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function isAuthorized(password: string): boolean {
  if (!ADMIN_PASSWORD) return false;
  return password === ADMIN_PASSWORD;
}

export async function fetchAdminAchievements(password: string) {
  if (!isAuthorized(password)) {
    return { success: false, error: "Invalid credentials" };
  }

  try {
    const colRef = collection(db, "achievements");
    // Sort newest first
    const q = query(colRef, orderBy("createdAt", "desc"));
    let snapshot;
    try {
      snapshot = await getDocs(q);
    } catch {
      // Fallback in case index on createdAt is building
      snapshot = await getDocs(colRef);
    }

    const achievements: AchievementItem[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        studentId: data.studentId || undefined,
        fullName: data.fullName || "",
        department: data.department || "",
        rollNumber: data.rollNumber || "",
        achievements: data.achievements || "",
        picture: data.picture || "",
        dateYear: data.dateYear || "",
        category: data.category || "Other",
        additionalNotes: data.additionalNotes || undefined,
        status: data.status || "SUBMITTED",
        featured: !!data.featured,
        createdAt: data.createdAt || new Date().toISOString(),
      } as AchievementItem;
    });

    // Ensure sorted newest first
    achievements.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return { success: true, achievements };
  } catch (err: any) {
    console.error("Error fetching admin achievements:", err);
    return { success: false, error: err.message || "Failed to fetch achievements" };
  }
}

export async function updateAchievementStatus(
  password: string,
  id: string,
  status: string
) {
  if (!isAuthorized(password)) {
    return { success: false, error: "Invalid credentials" };
  }

  try {
    const docRef = doc(db, "achievements", id);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (err: any) {
    console.error("Error updating achievement status:", err);
    return { success: false, error: err.message || "Failed to update status" };
  }
}

export async function deleteAchievement(password: string, id: string) {
  if (!isAuthorized(password)) {
    return { success: false, error: "Invalid credentials" };
  }

  try {
    const docRef = doc(db, "achievements", id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting achievement:", err);
    return { success: false, error: err.message || "Failed to delete document" };
  }
}

