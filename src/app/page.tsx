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
        <div className="min-h-screen bg-gray-100 flex justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Todo App</h1>

                {/* Input Section */}
                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                    <div className="flex-1 w-full">
                        <input
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            placeholder="Enter a task"
                            className="md:w-[310px] w-full h-[50px] p-3 border border-gray-300 rounded-md mb-3"
                        />

                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="bg-purple-600 text-white rounded-md p-3 cursor-pointer w-full sm:w-[200px]"
                            />
                            <Image
                                urlEndpoint="https://ik.imagekit.io/nkz2lvnjd"
                                src={image || "https://ik.imagekit.io/nkz2lvnjd/default-image.jpg?updatedAt=1750792457047"}
                                width={100}
                                height={100}
                                alt="Todo image"
                                className="rounded-md object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex sm:flex-row flex-wrap gap-2 md:gap-3">
                        <button
                            onClick={handleAdd}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
                        >
                            Add
                        </button>

                        <button
                            onClick={handleUpdate}
                            disabled={!editId}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-md w-full sm:w-auto disabled:opacity-50"
                        >
                            Update
                        </button>

                        <button
                            onClick={handleDelete}
                            disabled={!editId}
                            className="bg-red-500 text-white px-4 py-2 rounded-md w-full sm:w-auto disabled:opacity-50"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {/* Todo List */}
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
                                    className="rounded-md object-cover"
                                />
                            )}
                            <span className="text-gray-700 break-words">{todo.title}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Home;
