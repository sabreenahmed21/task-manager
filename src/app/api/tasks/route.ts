/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title, description, important, completed } = await req.json();
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    await prisma.task.create({
      data: {
        title,
        description,
        important,
        completed,
        userId
      },
    });
    return NextResponse.json(
      { message: "Task created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    const url = new URL(req.url);
    const filter = url.searchParams.get("filter") || "all";
    let whereClause: any = { userId };
    if (filter === "important") {
      whereClause.important = true;
    } else if (filter === "completed") {
      whereClause.completed = true;
    } else if (filter === "incomplete") {
      whereClause.completed = false;
    }
    const tasks = await prisma.task.findMany({
      where: whereClause,
    });
    //const tasks = await prisma.task.findMany();
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error getting tasks" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }
    await prisma.task.delete({
      where: { id: id ,  userId: userId },
    });
    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting task:", error);
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  }
}