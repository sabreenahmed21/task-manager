import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
  }
  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword) {
    return NextResponse.json(
      { error: "Current password is required" },
      { status: 400 }
    );
  }
  if (!newPassword) {
    return NextResponse.json(
      { error: "New password is required" },
      { status: 400 }
    );
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }
    if (!user.password) {
      return NextResponse.json(
        {
          error:
            "This user does not have a password, is logged in with a Google or GitHub account.",
        },
        { status: 400 }
      );
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await prisma.user.update({
      where: { id: session?.user?.id },
      data: { password: hashedPassword },
    });
    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
