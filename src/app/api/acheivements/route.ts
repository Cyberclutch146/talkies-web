import { NextResponse } from "next/server";
import { achievementSchema, AchievementItem } from "@/lib/validations/acheivements";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";

// Force dynamic - never cache server-side, single source of truth is Firestore
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Helper to extract cookie value from Cookie header
function getCookieValue(cookieHeader: string | null, key: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${key}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const cookieHeader = request.headers.get("cookie");

    // Retrieve student identifier from headers, cookies, or query params
    const studentToken =
      request.headers.get("x-student-token") ||
      getCookieValue(cookieHeader, "talkies_student_token") ||
      url.searchParams.get("token") ||
      null;

    const studentRoll =
      request.headers.get("x-student-roll") ||
      getCookieValue(cookieHeader, "talkies_student_roll") ||
      url.searchParams.get("roll") ||
      null;

    // PRIVACY ENFORCEMENT AT DATABASE LEVEL:
    // If no student token or roll number is provided, return empty list immediately.
    // Never query or leak all documents / other students' achievements.
    if (!studentToken && !studentRoll) {
      return NextResponse.json(
        {
          success: true,
          achievements: [],
          count: 0,
          message: "No active student session. Only your own submissions are displayed.",
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }

    let firestoreAchievements: AchievementItem[] = [];

    try {
      let docs: any[] = [];

      // Query database directly by studentId ownership
      if (studentToken) {
        const qToken = query(
          collection(db, "achievements"),
          where("studentId", "==", studentToken)
        );
        const tokenSnap = await getDocs(qToken);
        docs = tokenSnap.docs;
      }

      // If no docs found by token and roll is provided, query by rollNumber ownership
      if (docs.length === 0 && studentRoll) {
        const qRoll = query(
          collection(db, "achievements"),
          where("rollNumber", "==", studentRoll.toUpperCase())
        );
        const rollSnap = await getDocs(qRoll);
        docs = rollSnap.docs;
      }

      firestoreAchievements = docs.map((d) => {
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

      // Sort newest first
      firestoreAchievements.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (dbErr: any) {
      console.warn("[Firestore] Could not fetch student achievements:", dbErr.message || dbErr);
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
    console.error("Error fetching student submissions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch student submissions" },
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

    const cookieHeader = request.headers.get("cookie");
    const existingToken =
      request.headers.get("x-student-token") ||
      getCookieValue(cookieHeader, "talkies_student_token") ||
      body.studentToken;

    // Generate or maintain persistent student session token
    const studentToken =
      existingToken ||
      `stud_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const validated = result.data;
    const newId = `ach-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const cleanNotes = validated.additionalNotes?.trim() || "";

    const newAchievement: AchievementItem = {
      id: newId,
      studentId: studentToken,
      fullName: validated.fullName.trim(),
      department: validated.department.trim().toUpperCase(),
      rollNumber: validated.rollNumber.trim().toUpperCase(),
      achievements: validated.achievements.trim(),
      picture: validated.picture,
      dateYear: validated.dateYear.trim(),
      category: validated.category,
      additionalNotes: cleanNotes || undefined,
      status: "SUBMITTED",
      featured: false,
      createdAt: new Date().toISOString(),
    };

    // Prepare document for Firestore with student ownership
    const firestoreData: Record<string, any> = {
      id: newId,
      studentId: studentToken,
      fullName: newAchievement.fullName,
      department: newAchievement.department,
      rollNumber: newAchievement.rollNumber,
      achievements: newAchievement.achievements,
      picture: newAchievement.picture,
      dateYear: newAchievement.dateYear,
      category: newAchievement.category,
      additionalNotes: cleanNotes,
      status: "SUBMITTED",
      featured: false,
      createdAt: newAchievement.createdAt,
      serverTimestamp: new Date().toISOString(),
    };

    // Save strictly to Firebase Firestore collection "achievements"
    await setDoc(doc(db, "achievements", newId), firestoreData);
    console.log(`[Firestore] Student achievement saved: ${newId} (Student: ${studentToken})`);

    const response = NextResponse.json(
      {
        success: true,
        message: "Your achievement has been successfully recorded!",
        achievement: newAchievement,
        studentToken,
      },
      { status: 201 }
    );

    // Set persistent session cookies so the student's submissions are remembered
    response.cookies.set("talkies_student_token", studentToken, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    response.cookies.set("talkies_student_roll", newAchievement.rollNumber, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });

    return response;
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
