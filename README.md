# Simple Todo App (React + MongoDB Atlas)

A beginner-friendly full-stack Todo App using **React (with TypeScript)** for the frontend and **MongoDB Atlas** for the backend data storage. This app allows you to:

- Add tasks
- Update tasks
- Delete tasks
- Select tasks from a list
- View everything in a clean UI (Tailwind CSS)

---

## Preview

---

## Tech Stack

- React + TypeScript
- MongoDB Atlas (cloud database)
- Tailwind CSS (UI styling)
- API functions for database calls

---

## Project Structure
- my-todo-app/
  ├── app/
  │ └── page.tsx # Main component
  ├── lib/
  │ └── function.ts # MongoDB functions (add, get, update, delete)
  ├── styles/
  │ └── globals.css # Tailwind setup
  ├── .env.local # MongoDB URI (secure)
  ├── README.md
  └── ...

## 1. How to Set Up MongoDB Atlas

### Step-by-Step

1. Visit: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)  
2. Click **Start Free**, sign up with your email or GitHub  
3. Create a **free shared cluster**  
   - Choose any **cloud provider** (AWS recommended)
   - Choose the free tier (M0)
   - Name your cluster, e.g. `Cluster0`

### Create a User

1. Go to **Database Access**  
2. Add a new user  
   - Username: `admin`, Password: `yourpassword`
   - Set Role to **Atlas Admin**

### Allow Access From Anywhere

1. Go to **Network Access**  
2. Add IP address → Allow Access from Anywhere: `0.0.0.0/0`

---

## 2. Connect MongoDB to the App

### Add URI to `.env.local`

After setting up your cluster, click **Connect > Connect your application**  
- Copy the **connection string**, e.g.:
`MONGODB_URI=mongodb+srv://admin:yourpassword@cluster0.mongodb.net/todo-app?retryWrites=true&w=majority`

Add it to your `.env.local` file in the root of your project.

---

## 3. Install Dependencies

```
npm install
```

Make sure your project uses:
- react
- tailwindcss
- mongodb

If not, run:
```
npm install tailwindcss postcss autoprefixer
npm install mongodb
```

4. Run the App
```
npm run dev
```
Open project in your browser.

5. MongoDB Functions (lib/function.ts)
```
// lib/function.ts
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = 'todo-app';

export async function getTodos() {
  await client.connect();
  const db = client.db(dbName);
  const todos = await db.collection('todos').find().toArray();
  return todos.map(({ _id, title, completed }) => ({
    id: _id.toString(),
    title,
    completed,
  }));
}

export async function addTodo(title: string) {
  await client.connect();
  const db = client.db(dbName);
  await db.collection('todos').insertOne({ title, completed: false });
}

export async function updateTodo(id: string, title: string) {
  await client.connect();
  const db = client.db(dbName);
  await db.collection('todos').updateOne(
    { _id: new ObjectId(id) },
    { $set: { title } }
  );
}

export async function deleteTodo(id: string) {
  await client.connect();
  const db = client.db(dbName);
  await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
}
```

## How the App Works
# Add Task
1. Type your task in the input box
2. Click Add
3. The task is saved in MongoDB

# Update Task
1. Click a task from the list (loads into input)
2. Edit the text
3. Click Update to save changes

# Delete Task
1. Select a task
2. Click Delete to remove it from the database

## Keep Building!

This project is just the beginning of your full-stack journey. You've combined:

- Frontend skills (React + Tailwind CSS)
- Backend integration (MongoDB Atlas)
- Real-world app logic (CRUD operations)

Take a moment to appreciate how far you've come — you built a real, database-connected application! 🎉
