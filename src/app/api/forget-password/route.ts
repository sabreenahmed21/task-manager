/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request ) {
  const { email } = await req.json();

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user || !user.password) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: resetCode,
      resetTokenExpires: resetCodeExpires,
    },
  });

  // Send email with reset link
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Password Reset Request",
    text: `Password Reset Request: ${resetCode}`,
    html: `<p> Password Reset Request: <strong>${resetCode}</strong></p>`,
  });

  return NextResponse.json({ message: "Password reset email sent successfully." }, { status: 200 });
}
