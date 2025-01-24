import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
import Swal from "sweetalert2"; 

export default function RemoveBtn({ id, onTaskDeleted }: { id: string, onTaskDeleted: () => void }) {
  const deleteTask = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/tasks?id=${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error("Failed to delete task");
        }
        onTaskDeleted(); 
        Swal.fire({
          title: "Deleted!",
          text: "Your task has been deleted.",
          icon: "success",
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error deleting task:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the task.",
          icon: "error",
        });
      }
    }
  };

  return (
    <button onClick={deleteTask} aria-label="Delete task">
      <HiOutlineTrash className="text-red-500 hover:text-red-700 sm:size-7 size-5" />
    </button>
  );
}