"use client";

import React, { useEffect, useState } from "react";
import RemoveBtn from "./RemoveBtn";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";


type Task = {
  id: number;
  title: string;
  description: string;
  important: boolean;
  completed: boolean;
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data: { tasks: Task[] } = await res.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  

  return (
    <div className="space-y-4">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 border border-red-300 my-3 flex justify-between items-start"
          >
            <div>
              <h2 className="font-bold text-2xl">{task.title}</h2>
              <div>{task.description}</div>
              <div className="mt-2">
                {task.important && (
                  <span className="text-yellow-500">Important</span>
                )}
                {task.completed && (
                  <span className="text-green-500 ml-2">Completed</span>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <RemoveBtn id={task.id.toString()} onTaskDeleted={fetchTasks} />
              <Link href={`/edit-task/${task.id}`}>
                <HiPencilAlt size={24} />
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
}
