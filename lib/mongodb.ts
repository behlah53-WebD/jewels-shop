import { Db, MongoClient } from "mongodb";

let client: MongoClient | undefined;

/**
 * Connect to MongoDB Atlas only when MONGODB_URI has been supplied.
 * The storefront deliberately renders without a database connection during preview.
 */
export async function getMongoDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  client ??= new MongoClient(uri);
  await client.connect();
  return client.db(process.env.MONGODB_DB_NAME || "aurelia_jewels");
}
