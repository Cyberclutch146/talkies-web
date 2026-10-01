"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc, orderBy, query } from "firebase/firestore";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "rcc_talkies_admin2024";

export async function fetchAgomoniRegistrations(password: string) {
  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: "Invalid credentials" };
  }
  
  try {
    const q = query(collection(db, "agomoniRegistrations"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    const registrations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, registrations };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateAgomoniStatus(password: string, id: string, status: string) {
  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: "Invalid credentials" };
  }
  
  try {
    const docRef = doc(db, "agomoniRegistrations", id);
    await updateDoc(docRef, { status });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
