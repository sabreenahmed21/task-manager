import { auth } from "@/auth";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await auth();
  const transformedSession = session
    ? {
        user: {
          name: session.user?.name ?? undefined,
          email: session.user?.email ?? undefined,
          image: session.user?.image ?? undefined,
        },
      }
    : null;

  return <NavbarClient session={transformedSession} />;
}
