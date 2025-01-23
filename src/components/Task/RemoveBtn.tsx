
import React from "react";
import { HiOutlineTrash } from "react-icons/hi";

export default function RemoveBtn({ id, onTaskDeleted }: { id: string, onTaskDeleted: () => void }) {
  const deleteTask = async () => {
    try {
      const res = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      const data = await res.json();
      console.log("Task deleted:", data);
      onTaskDeleted(); 
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <button onClick={deleteTask} aria-label="Delete task">
      <HiOutlineTrash size={24} className="text-red-500 hover:text-red-700" />
    </button>
  );
}
