import { auth } from "@/auth";
import Link from "next/link";
import React from "react";
import Logout from "./Logout";

export default async function Navbar() {
  const session = await auth();
  return (
    <>
      {!session?.user ? (
        <Link href={"/auth/login"}>
          <p className="p-2 bg-blue-400">login</p>
        </Link>
      ) : (
        <Logout />
      )}
    </>
  );
}
