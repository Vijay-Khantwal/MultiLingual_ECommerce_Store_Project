import mongoose from "mongoose";

export default async function connect() {
  const dbUrl = process.env.DATABASE_URL;

  try {
    const res = await mongoose.connect(dbUrl);
    if (res) {
      console.log("Connected to Database...");
      return res;
    }

    return undefined;
  } catch (err) {
    console.log("Error connecting to Database: ", err);
    return err;
  }
}
