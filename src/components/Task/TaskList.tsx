"use client";
import React, { useEffect, useState, useCallback } from "react";
import RemoveBtn from "./RemoveBtn";
import { HiPencilAlt, HiPlus } from "react-icons/hi";
import { MdLabelImportant } from "react-icons/md";
import dynamic from "next/dynamic";

const Modal = dynamic(() => import("react-modal"), { ssr: false });

type Task = {
  id: string;
  title: string;
  description: string;
  important: boolean;
  completed: boolean;
};

interface FilterButtonProps {
  label: string;
  filterType: "all" | "important" | "completed" | "incomplete";
  currentFilter: "all" | "important" | "completed" | "incomplete";
  onClick: () => void;
  bgColor: string;
  textColor: string;
  outlineColor: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  filterType,
  currentFilter,
  onClick,
  bgColor,
  textColor,
  outlineColor,
}) => {
  const isActive = filterType === currentFilter;
  return (
    <button
      onClick={onClick}
      className={`sm:px-4 px-2 py-1 rounded-full text-sm font-medium ${
        isActive ? `border-2 outline-2 outline-${outlineColor} outline` : ""
      } ${bgColor} ${textColor}`}
    >
      {label}
    </button>
  );
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "important" | "completed" | "incomplete"
  >("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [important, setImportant] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filter: string) => {
    try {
      const res = await fetch(`/api/tasks?filter=${filter}`);
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
  }, []);

  useEffect(() => {
    fetchTasks(filter);
  }, [filter, fetchTasks]);

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setTitle("");
    setDescription("");
    setImportant(false);
    setCompleted(false);
  };

  const openEditModal = (task: Task) => {
    setEditTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setImportant(task.important);
    setCompleted(task.completed);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditTaskId(null);
    setTitle("");
    setDescription("");
    setImportant(false);
    setCompleted(false);
  };

  const addTask = async (e: { preventDefault: () => void }) => {
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
      setTasks([...tasks, data.task]);
      fetchTasks(filter);
      closeAddModal();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!editTaskId) return;
    try {
      const res = await fetch(`/api/tasks/${editTaskId}`, {
        method: "PUT",
        body: JSON.stringify({ title, description, important, completed }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("Failed to update task");
      }
      const data = await res.json();
      setTasks(
        tasks.map((task) => (task.id === editTaskId ? data.task : task))
      );
      fetchTasks(filter);
      closeEditModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const filters = [
    {
      label: "All",
      filterType: "all" as const,
      bgColor: "bg-blue-500",
      textColor: "text-white",
      outlineColor: "blue-600",
    },
    {
      label: "Important",
      filterType: "important" as const,
      bgColor: "bg-important-color",
      textColor: "text-white",
      outlineColor: "important-color",
    },
    {
      label: "Complete",
      filterType: "completed" as const,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      outlineColor: "green-200",
    },
    {
      label: "Incompleted",
      filterType: "incomplete" as const,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      outlineColor: "red-200",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl my-6 px-6">
      <div className="flex items-center justify-between">
        <div className="hidden sm:flex gap-2">
          {filters.map(
            ({ label, filterType, bgColor, textColor, outlineColor }) => (
              <FilterButton
                key={filterType}
                label={label}
                filterType={filterType}
                currentFilter={filter}
                onClick={() => setFilter(filterType)}
                bgColor={bgColor}
                textColor={textColor}
                outlineColor={outlineColor}
              />
            )
          )}
        </div>
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-around border-t border-gray-300">
          {filters.map(
            ({ label, filterType, bgColor, textColor, outlineColor }) => (
              <FilterButton
                key={filterType}
                label={label}
                filterType={filterType}
                currentFilter={filter}
                onClick={() => setFilter(filterType)}
                bgColor={bgColor}
                textColor={textColor}
                outlineColor={outlineColor}
              />
            )
          )}
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-task-color hover:bg-yellow-600 text-white rounded flex items-center gap-1 ml-auto"
        >
          <HiPlus />
          <span className="hidden md:inline">Add New Task</span>
        </button>
      </div>

      <div className="my-6 space-y-4">
        {tasks?.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task?.id}
              className="flex justify-between items-start rounded-lg p-4 bg-gray-100 gap-2"
            >
              <div className="max-w-xl">
                <h2 className="font-bold sm:text-xl text-base text-gray-800 whitespace-pre-line break-words">
                  {task?.title || "No Title"}
                </h2>
                <p className="text-gray-600 mt-1 sm:text-xl text-sm whitespace-pre-line break-words">
                  {task?.description || "No Description"}
                </p>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-2">
                <div>
                  {task?.completed ? (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Incompleted
                    </span>
                  )}
                </div>
                <div>
                  {task?.important && (
                    <MdLabelImportant className="text-important-color size-5 sm:size-8" />
                  )}
                </div>
                <button
                  onClick={() => openEditModal(task)}
                  className="text-black cursor-pointer"
                >
                  <HiPencilAlt className="sm:size-8 size-5" />
                </button>
                <RemoveBtn
                  id={task?.id}
                  onTaskDeleted={() => fetchTasks(filter)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center">
            <p>It looks like there are no tasks available.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={closeAddModal}
        contentLabel="Add Task Modal"
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        <form onSubmit={addTask} className="space-y-4">
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
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Task Modal"
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={updateTask} className="space-y-4">
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
            Update Task
          </button>
        </form>
      </Modal>
    </div>
  );
}
