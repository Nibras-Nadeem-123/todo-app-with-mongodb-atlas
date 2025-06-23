// lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Extend the NodeJS.Global interface to include _mongoClientPromise
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) throw new Error('Please define MONGODB_URI in .env.local');

if (process.env.NODE_ENV === 'development') {
 
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
 
    global._mongoClientPromise = client.connect();
  }
  
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
