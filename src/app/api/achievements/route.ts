import { NextResponse } from "next/server";
import { achievementSchema, AchievementItem } from "@/lib/validations/achievement";
import initialAchievements from "@/data/achievements.json";

// In-memory runtime cache for achievements submitted during this server session
const runtimeAchievements: AchievementItem[] = [];

export async function GET() {
  try {
    const combined = [...runtimeAchievements, ...(initialAchievements as AchievementItem[])];
    return NextResponse.json({
      success: true,
      achievements: combined,
      count: combined.length,
    });
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

    // Honeypot check
    if (body._honey) {
      return NextResponse.json({
        success: true,
        message: "Achievement recorded successfully!",
      });
    }

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

    const newAchievement: AchievementItem = {
      id: `ach-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fullName: validated.fullName.trim(),
      department: validated.department.trim().toUpperCase(),
      rollNumber: validated.rollNumber.trim().toUpperCase(),
      achievements: validated.achievements.trim(),
      picture: validated.picture,
      dateYear: validated.dateYear.trim(),
      category: validated.category,
      additionalNotes: validated.additionalNotes?.trim() || undefined,
      featured: false,
      createdAt: new Date().toISOString(),
    };

    // Prepend to runtime list
    runtimeAchievements.unshift(newAchievement);

    return NextResponse.json(
      {
        success: true,
        message: "Your achievement has been submitted to RCC Talkies Database!",
        achievement: newAchievement,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting achievement:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
