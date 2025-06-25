"use client";
import React, { useEffect, useState, useRef } from "react";
import { addTodo, deleteTodo, getTodos, updateTodo } from "@/lib/function";
import { Image } from "@imagekit/next";
import { imagekit } from "@/lib/upload-auth"; // your configured instance of ImageKit

interface Todo {
    id: string;
    title: string;
    completed: boolean;
    image: string;
}

const Home: React.FC = () => {
    const [task, setTask] = useState("");              // for task input
    const [todos, setTodos] = useState<Todo[]>([]);    // list of todos
    const [image, setImage] = useState<string>("");    // image URL
    const [editId, setEditId] = useState("");          // which todo is selected for editing
    const fileInputRef = useRef<HTMLInputElement>(null); // reference to file input element

    // Fetch todos on first render
    useEffect(() => {
        fetchTodos();
    }, []);

    // Fetch all todos from backend
    const fetchTodos = async () => {
        const data = await getTodos();
        setTodos(data);
    };

    // Handle uploading image to ImageKit
    const handleImageUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) return;
        const result = await imagekit.upload({
            file,
            fileName: file.name,
        });
        const response = result.url
        setImage(response);
        console.log("Upload successful:", response);
        alert("Image Upload Successfully!")
    };

    // Add new todo with task + uploaded image URL
    const handleAdd = async () => {
        if (!task.trim()) return;

        await addTodo(task, image);
        resetForm();
        fetchTodos();
    };

    // Update existing todo by ID
    const handleUpdate = async () => {
        if (!task.trim() || !editId) return; 

        await updateTodo(editId, task, image);
        resetForm();
        fetchTodos();
    };

    // Delete todo by ID
    const handleDelete = async () => {
        if (!editId) return;

        await deleteTodo(editId);
        resetForm();
        fetchTodos();
    };

    // Reset all input fields
    const resetForm = () => {
        setTask("");
        setEditId("");
        setImage("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // When a user selects a todo to edit
    const handleSelectTodo = (todo: Todo) => {
        setTask(todo.title);
        setEditId(todo.id);
        setImage(todo.image);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="min-h-screen flex justify-center items-start bg-gray-100 p-6">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Todo App</h1>

                {/* Input section */}
                <div className="flex gap-6 mb-3">
                    <div>
                        <input
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            placeholder="Enter a task"
                            className="flex-1 p-3 border w-[320px] h-[50px] border-gray-300 rounded-md mb-2"
                        />

                        <div className="flex justify-around gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="flex-1 p-3 border w-[180px] h-[50px] bg-purple-600 text-white rounded-md cursor-pointer"
                            />
                            <Image
                                urlEndpoint="https://ik.imagekit.io/nkz2lvnjd"
                                src={image || "https://ik.imagekit.io/nkz2lvnjd/default-image.jpg?updatedAt=1750792457047"}
                                width={100}
                                height={100}
                                alt="Todo image"
                                className="rounded-md"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
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
                        className="px-4 py-2 bg-red-500 text-white rounded-md disabled:opacity-50"
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
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                        >
                            {todo.image && (
                                <Image
                                    urlEndpoint="https://ik.imagekit.io/nkz2lvnjd"
                                    src={todo.image}
                                    width={100}
                                    height={100}
                                    alt="Todo image"
                                />
                            )}
                            <span className="text-gray-700 break-all max-w-xs">{todo.title}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Home;
