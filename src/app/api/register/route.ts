import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export const config = {
  runtime: "nodejs",
};

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { error: "User already exists and email is verified" },
          { status: 400 }
        );
      } else {
        const verificationCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString(); // code consist of 6numbers
        await prisma.verificationToken.upsert({
          where: {
            identifier_token: {
              identifier: email.toLowerCase(),
              token: verificationCode,
            },
          },
          update: {
            token: verificationCode,
            expires: new Date(Date.now() + 3600 * 1000), //invalid 1h
          },
          create: {
            identifier: email.toLowerCase(),
            token: verificationCode,
            expires: new Date(Date.now() + 3600 * 1000), // invalid 1h
          },
        });

        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Your Verification Code",
          text: `Your verification code is: ${verificationCode}`,
          html: `<p>Your verification code is:</p><h1>${verificationCode}</h1>`,
        });

        return NextResponse.json(
          {
            message: "Verification code resent. Please check your inbox.",
          },
          { status: 200 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    await prisma.verificationToken.create({
      data: {
        identifier: email.toLowerCase(),
        token: verificationCode,
        expires: new Date(Date.now() + 3600 * 1000),
      },
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${verificationCode}`,
      html: `<p>Your verification code is:</p><h1>${verificationCode}</h1>`,
    });

    return NextResponse.json(
      {
        message:
          "User registered successfully. Please verify your email using the code sent to your inbox.",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in registration route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
