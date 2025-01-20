import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, resetCode } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  console.log(user)

  if (!user || user.resetToken !== resetCode || (user.resetTokenExpires && new Date() > user.resetTokenExpires)) {
    return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
  }

  return NextResponse.json({ message: "Code verified successfully." }, { status: 200 });
}