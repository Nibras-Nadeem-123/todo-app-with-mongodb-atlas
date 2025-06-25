"use client";

import React, { useEffect, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from '@/lib/function';
import { CldImage, CldUploadButton } from 'next-cloudinary';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  imageUrl: string;
}

interface UploadImage {
  event: "success";
  info: { public_id: string };
}

const Home: React.FC = () => {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [image, setImage] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const data = await getTodos();
    setTodos(data);
  };

  const handleAdd = async () => {
    if (!task.trim()) return;
    await addTodo(task, image);
    resetForm();
    fetchTodos();
  };

  const handleUpdate = async () => {
    if (!task.trim() || !editId) return;
    await updateTodo(editId, task, image);
    resetForm();
    fetchTodos();
  };

  const handleDelete = async () => {
    if (!editId) return;
    await deleteTodo(editId);
    resetForm();
    fetchTodos();
  };

  const resetForm = () => {
    setTask('');
    setEditId(null);
    setImage("");
  };

  const handleSelectTodo = (todo: Todo) => {
    setTask(todo.title);
    setEditId(todo.id);
    setImage(todo.imageUrl);
  };

  const handleImageUpload = (result: unknown) => {
    const uploadResult = result as UploadImage;
    const publicId = uploadResult.info.public_id;
    setImage(publicId);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
  <div className="max-w-xl mx-auto bg-white p-6 rounded-md shadow">
    <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">Todo App</h1>

    {/* Task input and image upload */}
    <input
      value={task}
      onChange={(e) => setTask(e.target.value)}
      placeholder="Enter task"
      className="w-full mb-3 p-2 border border-gray-300 rounded"
    />

    <div className="mb-3">
      <CldUploadButton
        uploadPreset="hdsjakrv"
        onSuccess={handleImageUpload}
        className="bg-purple-600 text-white px-4 py-2 rounded cursor-pointer"
      />
    </div>

    {/* Show uploaded image */}
    <div className="mb-4">
      <CldImage
        width="100"
        height="100"
        src={image || "https://res.cloudinary.com/dig8copia/image/upload/v1732465835/samples/logo.png"}
        alt="Preview"
        className="rounded border bg-blue-600"
      />
    </div>

    {/* Buttons */}
    <div className="flex gap-2 mb-6">
      <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">
        Add
      </button>
      <button
        onClick={handleUpdate}
        disabled={!editId}
        className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Update
      </button>
      <button
        onClick={handleDelete}
        disabled={!editId}
        className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Delete
      </button>
    </div>

    {/* Todo list */}
    <ul className="space-y-3">
      {todos.map((todo) => (
        <li
          key={todo.id}
          onClick={() => handleSelectTodo(todo)}
          className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-gray-50"
        >
          <CldImage
            width="60"
            height="60"
            src={todo.imageUrl}
            alt="Todo"
            className="rounded border"
          />
          <span>{todo.title}</span>
        </li>
      ))}
    </ul>
  </div>
</div>

  );
};

export default Home;
