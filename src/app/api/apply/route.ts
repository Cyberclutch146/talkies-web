import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  leadApplicationSchema,
  teamApplicationSchema,
} from "@/lib/validations/application";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body.type !== "string") {
      return NextResponse.json(
        { message: "Invalid request: missing application type" },
        { status: 400 }
      );
    }

    // Validate based on application type
    let validatedData;
    if (body.type === "LEAD") {
      validatedData = leadApplicationSchema.parse(body);
    } else if (body.type === "TEAM") {
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
        type: validatedData.type,
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
        type: validatedData.type,
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
      const fieldErrors = error.errors.map((e) => ({
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

    return NextResponse.json(
      { message: "An internal error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
