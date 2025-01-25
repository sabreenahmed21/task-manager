import { prisma } from "./prisma";

export async function deleteUser(userId: string) {
  try {
    await prisma.task.deleteMany({
      where: { userId },
    });

    await prisma.session.deleteMany({
      where: { userId },
    });

    await prisma.account.deleteMany({
      where: { userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true, message: 'User deleted successfully' };
  } catch{
    return { success: false, message: 'Failed to delete user' };
  }
}