import { NextResponse } from "next/server";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { id, name, email, password, role, active }: User = await req.json();
  if (!name || !password || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const userExit = await prisma.user.findUnique({
        where: { id },
      });
      if (userExit) {
        const pwd =
          userExit.password !== password
            ? await bcrypt.hash(password, 10)
            : userExit.password;
        const user = await prisma.user.update({
          where: { id },
          data: { name, email, password: pwd, role: role, active },
        });
        return NextResponse.json(user, { status: 200 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { id }: User = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const userExit = await prisma.user.delete({
        where: { id },
      });
      return NextResponse.json({}, { status: 201 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
}
