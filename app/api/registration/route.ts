import { NextRequest, NextResponse } from "next/server";
import { Registration } from "@prisma/client";
import prisma from "@/lib/prisma";
import { extractPrismaErrorMessage } from "@/utils/helpers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const registedUser = await prisma.registration.findUnique({
        where: { id: parseInt(id) },
      });
      if (!registedUser) {
        return NextResponse.json(
          { error: "Registration not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(registedUser, { status: 200 });
    }

    const classes = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(classes, { status: 200 });
  } catch (e) {
    console.error("Prisma Error:", e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      {
        error: userMessage,
        details: technicalMessage,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const {
    id,
    name,
    email,
    phone,
    studyGroup,
    companyInfo,
    message,
    type,
    isProcessed,
  }: Registration = await req.json();
  if (!name || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const registerExist = await prisma.registration.findUnique({
        where: { id },
      });
      if (registerExist) {
        return NextResponse.json(
          { error: "Registration already exists" },
          { status: 400 }
        );
      }
      // update logic needed
      const updatedRegister = await prisma.registration.update({
        where: { id },
        data: {
          name,
          email,
          phone,
          type,
          companyInfo,
          studyGroup,
          message,
          isProcessed,
        },
      });
      return NextResponse.json(updatedRegister, { status: 200 });
    }

    const registration = await prisma.registration.create({
      data: {
        name,
        phone,
        studyGroup,
        type,
        companyInfo,
        message,
        email,
      },
    });
    return NextResponse.json(registration, { status: 201 });
    //TODO: send notification email here
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { id }: Registration = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const registerExit = await prisma.registration.delete({
        where: { id },
      });
      return NextResponse.json({}, { status: 201 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Registration does not exist" },
      { status: 400 }
    );
  }
}
