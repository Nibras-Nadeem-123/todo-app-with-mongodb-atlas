"use server";
// lib/todoService.ts
import clientPromise from './mongodb';
import { Db, ObjectId } from 'mongodb';

export async function getTodos() {
  const client = await clientPromise;
  const db: Db = client.db(process.env.MONGODB_DB);
  const todos = await db.collection('todos').find().toArray();

  return todos.map(todo => ({
    _id: todo._id.toString(),
    title: todo.title,
    completed: todo.completed,
  }));
}

export async function addTodo(title: string) {
  const client = await clientPromise;
  const db: Db = client.db(process.env.MONGODB_DB);
  await db.collection('todos').insertOne({ title, completed: false });
}

export async function toggleTodo(id: string, completed: boolean) {
  const client = await clientPromise;
  const db: Db = client.db(process.env.MONGODB_DB);
  await db.collection('todos').updateOne({ _id: new ObjectId(id) }, { $set: { completed } });
}

export async function deleteTodo(id: string) {
  const client = await clientPromise;
  const db: Db = client.db(process.env.MONGODB_DB);
  await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
}

export async function updateTodo(id: string, title: string) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  await db.collection("todos").updateOne(
    { _id: new ObjectId(id) },
    { $set: { title } }
  );
}
