import express from "express";
import authenticationRoutes from "./routes/authentication.routes";
import studentRoutes from "./routes/student.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();
app.use(express.json());

app.use("/api/auth", authenticationRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);

export default app;