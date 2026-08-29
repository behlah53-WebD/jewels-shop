import mongoose from "mongoose";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const DIRECT_FALLBACK_URI =
  "mongodb://Behlahjewels:Behlah786@ac-p9lrluy-shard-00-00.blbwshk.mongodb.net:27017,ac-p9lrluy-shard-00-01.blbwshk.mongodb.net:27017,ac-p9lrluy-shard-00-02.blbwshk.mongodb.net:27017/?ssl=true&replicaSet=atlas-v7j1f6-shard-0&authSource=admin&appName=Cluster0";

const MONGODB_URI = process.env.MONGODB_URI || DIRECT_FALLBACK_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (e) {}

    const opts = {
      bufferCommands: false,
      dbName: process.env.MONGODB_DB_NAME || "aurelia_jewels",
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).catch(async (err) => {
      if (err && (err.code === "ECONNREFUSED" || err.syscall === "querySrv")) {
        console.warn("⚠️ SRV DNS lookup failed. Falling back to direct cluster seedlist connection...");
        return mongoose.connect(DIRECT_FALLBACK_URI, opts);
      }
      throw err;
    }).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
