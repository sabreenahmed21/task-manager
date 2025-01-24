import Navbar from "@/components/Navbar";
import TaskList from "@/components/Task/TaskList";
import React from "react";

export default function page() {
  return (
    <div>
      <Navbar />
      <TaskList />
    </div>
  );
}
