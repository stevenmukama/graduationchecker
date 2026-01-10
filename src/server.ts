import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectToDatabase } from "./config/databaseConnection";

const PORT = process.env.PORT || 5000;

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});