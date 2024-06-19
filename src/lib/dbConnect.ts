import mongoose from "mongoose";

type connectOptions = {
  isConnected?: number;
};

const connection: connectOptions = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI!!, {
      dbName: "feedback",
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected");
  } catch (error) {
    console.log("Error connecting to database: ", error);
    process.exit(1);
  }
}

export default dbConnect;
