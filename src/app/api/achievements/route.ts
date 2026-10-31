import { NextResponse } from "next/server";
import { achievementSchema, AchievementItem } from "@/lib/validations/achievement";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";

// Force dynamic - never cache server-side, single source of truth is Firestore
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    let firestoreAchievements: AchievementItem[] = [];

    try {
      const snapshot = await getDocs(collection(db, "achievements"));
      firestoreAchievements = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          fullName: data.fullName || "",
          department: data.department || "",
          rollNumber: data.rollNumber || "",
          achievements: data.achievements || "",
          picture: data.picture || "",
          dateYear: data.dateYear || "",
          category: data.category || "Other",
          additionalNotes: data.additionalNotes || undefined,
          featured: !!data.featured,
          createdAt: data.createdAt || new Date().toISOString(),
        } as AchievementItem;
      });

      // Sort newest first
      firestoreAchievements.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (dbErr: any) {
      console.warn("[Firestore] Could not fetch achievements from Firestore:", dbErr.message || dbErr);
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        achievements: firestoreAchievements,
        count: firestoreAchievements.length,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot bot protection
    if (body._honey) {
      return NextResponse.json({
        success: true,
        message: "Achievement recorded successfully!",
      });
    }

    // Validation
    const result = achievementSchema.safeParse(body);
    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0]?.toString() ?? "_form";
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please verify your form inputs.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const validated = result.data;
    const newId = `ach-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const cleanNotes = validated.additionalNotes?.trim() || "";

    const newAchievement: AchievementItem = {
      id: newId,
      fullName: validated.fullName.trim(),
      department: validated.department.trim().toUpperCase(),
      rollNumber: validated.rollNumber.trim().toUpperCase(),
      achievements: validated.achievements.trim(),
      picture: validated.picture,
      dateYear: validated.dateYear.trim(),
      category: validated.category,
      additionalNotes: cleanNotes || undefined,
      featured: false,
      createdAt: new Date().toISOString(),
    };

    // Prepare document for Firestore without any undefined values
    const firestoreData: Record<string, any> = {
      id: newId,
      fullName: newAchievement.fullName,
      department: newAchievement.department,
      rollNumber: newAchievement.rollNumber,
      achievements: newAchievement.achievements,
      picture: newAchievement.picture,
      dateYear: newAchievement.dateYear,
      category: newAchievement.category,
      additionalNotes: cleanNotes,
      featured: false,
      createdAt: newAchievement.createdAt,
      serverTimestamp: new Date().toISOString(),
    };

    // Save strictly to Firebase Firestore collection "achievements"
    await setDoc(doc(db, "achievements", newId), firestoreData);
    console.log(`[Firestore] Achievement successfully written to database: ${newId}`);

    return NextResponse.json(
      {
        success: true,
        message: "Your achievement has been submitted to RCC Talkies Database!",
        achievement: newAchievement,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting achievement:", error);
    if (error.code === "permission-denied") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Firebase Rules Locked: Please open Firebase Console -> Firestore Database -> Rules tab and set 'allow read, write: if true;' then click Publish.",
        },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit achievement." },
      { status: 500 }
    );
  }
}
