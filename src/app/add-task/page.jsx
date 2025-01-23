"use client";

import React, { useState } from "react";

export default function AddTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [important, setImportant] = useState(false);
  const [completed, setCompleted] = useState(false);

  const addTask = async (e) => {
    e.preventDefault(); 

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          important,
          completed,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("Failed to add task");
      }
      const data = await res.json();
      setTitle("");
      setDescription("");
      setImportant(false);
      setCompleted(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="p-4">
      <form className="space-y-4" onSubmit={addTask}>
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
              name="important"
              checked={important}
              onChange={() => setImportant(!important)}
              className="mr-2"
            />
            Important
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="completed"
              checked={completed}
              onChange={() => setCompleted(!completed)}
              className="mr-2"
            />
            Completed
          </label>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Task
        </button>
      </form>
    </div>
  );
}
