"use client";
import { useEffect, useState } from "react";
import { addTodo, deleteTodo, getTodos, toggleTodo, updateTodo } from "@/app/example/lib/todoService";

interface Todo {
  _id: string;
  completed: boolean;
  title: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all");

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    const result = await getTodos(); 
    setTodos(result);
  };

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addTodo(title); // ✅ no fetch
    setTitle("");
    loadTodos();
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await toggleTodo(id, !completed);
    loadTodos();
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    loadTodos();
  };

  const handleEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleUpdate = async () => {
    if (!editTitle.trim() || !editingId) return;
    await updateTodo(editingId, editTitle);
    setEditingId(null);
    setEditTitle("");
    loadTodos();
  };

  return (
    <div className="max-w-3xl text-center mx-auto my-10">
      <h1 className="text-[40px] font-semibold text-cyan-900 shadow bg-blue-100 py-3">
        TODO APP
      </h1>

      <div className="flex mt-10 justify-center">
        <input
          type="text"
          placeholder="Enter Task to do."
          className="w-[300px] h-[50px] bg-gray-50 px-3 py-1 text-[20px] outline-none border"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-green-800 h-[50px] w-[90px] text-[24px] text-white ml-2 cursor-pointer"
        >
          Add
        </button>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1 rounded border cursor-pointer ${filter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-800"
            }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-1 rounded border cursor-pointer ${filter === "completed" ? "bg-blue-600 text-white" : "bg-white text-gray-800"
            }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("incomplete")}
          className={`px-4 py-1 rounded border cursor-pointer ${filter === "incomplete" ? "bg-blue-600 text-white" : "bg-white text-gray-800"
            }`}
        >
          Incomplete
        </button>
      </div>

      {/* Todo List */}
      <ul className="mt-10 space-y-4">
        {todos
          .filter((todo) => {
            if (filter === "completed") return todo.completed;
            if (filter === "incomplete") return !todo.completed;
            return true;
          })
          .map((todo) => (
            <li
              key={todo._id}
              className="flex justify-between items-center bg-gray-100 rounded px-4 py-2 max-w-lg mx-auto"
            >
              {editingId === todo._id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 mr-2 px-2 py-1 border focus:outline-none"
                  />
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2 cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditTitle("");
                    }}
                    className="text-gray-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span
                    onClick={() => handleToggle(todo._id, todo.completed)}
                    className={`text-[20px] cursor-pointer flex-1 text-left ${todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                      }`}
                  >
                    {todo.title}
                  </span>
                  <button
                    onClick={() => handleEdit(todo._id, todo.title)}
                    className="text-blue-600 text-[20px] mr-3 bg-blue-100 p-2 rounded-full cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="text-red-600 text-[20px] bg-red-100 p-2 rounded-full cursor-pointer"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
