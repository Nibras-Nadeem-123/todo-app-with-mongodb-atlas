"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db(process.env.MONGODB_DB);
const collection = db.collection('todos')

export async function getTodos() {
  await client.connect()
  const todos = await collection.find().toArray();
  await client.close()
  return todos.map((todo: any) => ({
    id: todo._id.toString(),
    title: todo.title,
    completed: todo.completed,
  }));
}

export async function addTodo(title: string) {
await client.connect() 
  await collection.insertOne({ title, completed: false });
    await client.close()
}

export async function deleteTodo(id: string) { 
await client.connect()
  await collection.deleteOne({ _id: new ObjectId(id) });
    await client.close()
}

export async function updateTodo(id: string, title: string) { 
await client.connect()
  await collection.updateOne({ _id: new ObjectId(id) },{ $set: { title }});
    await client.close()
}