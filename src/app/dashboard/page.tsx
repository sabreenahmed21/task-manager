import Navbar from "@/components/Navbar";
import TaskList from "@/components/Task/TaskList";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div>
      <Navbar />
      <Link href={'/add-task'}>add task</Link> 
      <TaskList />
    </div>
  );
}
