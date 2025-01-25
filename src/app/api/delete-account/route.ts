import { auth } from '@/auth';
import { deleteUser } from '@/lib/deleteUser';
import { NextResponse } from 'next/server';

export async function DELETE() {
const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
  }
  const userId = session?.user?.id;
  if (typeof userId !== 'string') {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }
  const result = await deleteUser(userId);
  if (result.success) {
    return NextResponse.json({ message: result.message }, { status: 200 });
  } else {
    return NextResponse.json({ message: result.message }, {status: 400 });
  }
}