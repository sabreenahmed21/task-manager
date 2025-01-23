import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  try {
    const task = await prisma.task.findUnique({
      where: { id },
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
  const { title, description, completed, important } = await req.json();
  try {
    const updatedTask = await prisma.task.update({
      where: { id },
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
