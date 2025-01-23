"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";  

export default function EditTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [important, setImportant] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) return; 

    const fetchTask = async () => {
      try {
        const res = await fetch(`/api/tasks/${id}`);
        if (!res.ok) throw new Error("Failed to fetch task");
        const data = await res.json();
        setTitle(data.task.title);
        setDescription(data.task.description);
        setImportant(data.task.important);
        setCompleted(data.task.completed);
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchTask();
  }, [id]);

  const updateTask = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, description, completed, important }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("Failed to update task");
      }
      await res.json();
      router.push("/dashboard");  
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (loading) return <div>Loading...</div>; 

  return (
    <div className="p-4">
      <form className="space-y-4" onSubmit={updateTask}>
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={important}
              onChange={() => setImportant(!important)}
              className="mr-2"
            />
            Important
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={completed}
              onChange={() => setCompleted(!completed)}
              className="mr-2"
            />
            Completed
          </label>
        </div>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Edit Task
        </button>
      </form>
    </div>
  );
}
