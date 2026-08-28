import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  leadApplicationSchema,
  teamApplicationSchema,
} from "@/lib/validations/application";
import { ZodError } from "zod";

/** Basic request-size guard (reject bodies > 10 KB). */
const MAX_BODY_SIZE = 10 * 1024;

export async function POST(req: Request) {
  try {
    // ── Guard: content-length sanity check ─────────────────────
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json(
        { message: "Request body too large." },
        { status: 413 }
      );
    }

    // ── Parse JSON body safely ─────────────────────────────────
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    if (!body || typeof (body as Record<string, unknown>).type !== "string") {
      return NextResponse.json(
        { message: "Invalid request: missing application type" },
        { status: 400 }
      );
    }

    const typedBody = body as Record<string, unknown>;

    // Validate based on application type
    let validatedData;
    if (typedBody.type === "LEAD") {
      validatedData = leadApplicationSchema.parse(body);
    } else if (typedBody.type === "TEAM") {
      validatedData = teamApplicationSchema.parse(body);
    } else {
      return NextResponse.json(
        { message: "Invalid application type. Must be LEAD or TEAM." },
        { status: 400 }
      );
    }

    // Check for duplicate applications (same email + same position)
    const existing = await prisma.application.findFirst({
      where: {
        collegeEmail: validatedData.collegeEmail,
        positionAppliedFor: validatedData.positionAppliedFor,
        type: validatedData.type as string,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          message: `You have already submitted an application for ${validatedData.positionAppliedFor}. Duplicate applications are not allowed.`,
        },
        { status: 409 }
      );
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        type: validatedData.type as string,
        name: validatedData.name.trim(),
        collegeEmail: validatedData.collegeEmail.toLowerCase().trim(),
        rollNumber: validatedData.rollNumber.trim(),
        yearOfStudy: validatedData.yearOfStudy,
        phoneNumber: validatedData.phoneNumber.trim(),
        positionAppliedFor: validatedData.positionAppliedFor,
        portfolioLink: validatedData.portfolioLink?.trim() || null,
        whyJoin: validatedData.whyJoin?.trim() || null,
      },
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        id: application.id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Application submission error:", error);

    if (error instanceof ZodError) {
      const fieldErrors = error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json(
        {
          message: "Validation failed. Please check your inputs.",
          errors: fieldErrors,
        },
        { status: 400 }
      );
    }

    // Prisma unique constraint violation (race-condition fallback)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        {
          message:
            "A duplicate application was detected. You may have already applied for this position.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "An internal error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
