import { redirect } from 'next/navigation';
import { auth } from '@/auth'; 

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect('/auth/login'); 
  }
  redirect('/dashboard'); 
}
