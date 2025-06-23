"use client";
import React, { useEffect, useState } from 'react';
import { addTodo, deleteTodo, getTodos, updateTodo } from '@/lib/function';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const Home = () => {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    const data = await getTodos();
    setTodos(data);
  };

  const handleAdd = async () => {
    if (!task) return;
    await addTodo(task);
    setTask('');
    loadTodos();
  };

  const handleUpdate = async () => {
    if (!task || !editId) return;
    await updateTodo(editId, task);
    setTask('');
    setEditId(null);
    loadTodos();
  };

  const handleDelete = async () => {
    if (!editId) return;
    await deleteTodo(editId);
    setTask('');
    setEditId(null);
    loadTodos();
  };

  const handleSelect = (todo: Todo) => {
    setTask(todo.title);
    setEditId(todo.id);
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 p-4">
      <div className="w-full max-w-lg ">
        <h1 className="text-2xl font-bold mb-4 text-center">TODO APP</h1>

        <div className="flex mb-4 gap-2">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Add
          </button>
          <button
            onClick={handleUpdate}
            disabled={!editId}
            className="bg-yellow-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            disabled={!editId}
            className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Delete
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              onClick={() => handleSelect(todo)}
              className="p-2 border rounded cursor-pointer hover:bg-gray-50"
            >
              {todo.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
