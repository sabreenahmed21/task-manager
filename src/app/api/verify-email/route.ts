// app/api/verify-email/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json(); 
    const { code, email } = body;

    console.log("Code:", code);
    console.log("Email:", email);


    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    // ابحث عن كود التحقق في جدول VerificationToken
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier: email.toLowerCase(), token: code } },
    });
    

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // تحقق من صلاحية الكود
    const isCodeValid =
      verificationToken.token === code &&
      new Date(verificationToken.expires) > new Date();

    if (!isCodeValid) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // تحديث حالة المستخدم كـ "تم التحقق"
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { emailVerified: new Date() }, // اضف وقت التحقق
    });

    // احذف الكود المستخدم من جدول VerificationToken
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email.toLowerCase(), token: code } },
    });
    

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in email verification route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

}

