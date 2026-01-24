import { NextResponse } from "next/server";
import { FranchiseApplication } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const {
    id,
    name,
    email,
    phone,
    companyInfo,
    message,
    isProcessed,
  }: FranchiseApplication = await req.json();
  if (!name || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const franchiseExist = await prisma.franchiseApplication.findUnique({
        where: { id },
      });
      if (franchiseExist) {
        return NextResponse.json(
          { error: "Application already exists" },
          { status: 400 }
        );
      }
      // update logic needed
      const updatedFranchise = await prisma.franchiseApplication.update({
        where: { id },
        data: {
          name,
          email,
          phone,
          companyInfo,
          message,
          isProcessed,
        },
      });
      return NextResponse.json(updatedFranchise, { status: 200 });
    }

    const franchise = await prisma.franchiseApplication.create({
      data: {
        name,
        email,
        phone,
        companyInfo,
        message,
      },
    });
    return NextResponse.json(franchise, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { id }: FranchiseApplication = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const franchiseExist = await prisma.franchiseApplication.delete({
        where: { id },
      });
      return NextResponse.json({}, { status: 201 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Franchise application does not exist" },
      { status: 400 }
    );
  }
}
