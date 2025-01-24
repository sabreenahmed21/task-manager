import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const session = await auth();
    const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    const task = await prisma.task.findUnique({
      where: { id, userId },
    });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.log("Error fetching task:", error);
    return NextResponse.json({ error: "Error fetching task" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  const { title, description, completed, important } = await req.json();
  try {
    const updatedTask = await prisma.task.update({
      where: { id, userId  },
      data: { title, description, completed, important },
    });
    return NextResponse.json(
      { message: "Successfully updated task", updatedTask },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error updating task" }, { status: 500 });
  }
}
