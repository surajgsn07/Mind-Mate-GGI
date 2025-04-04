import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./helpers/db.helper.js";
import chatRouter from "./routes/chat.routes.js";
import userRouter from "./routes/user.route.js";
import slotRouter from "./routes/slots.js";
import appointmentRouter from "./routes/appointment.route.js";

import therapistRouter from './routes/therapist.route.js';
import eventRouter from "./routes/events.routes.js";
import { chatSockets } from "./sockets/chat.sokets.js";
import communityRouter from "./routes/community.routes.js";
import interviewRouter from "./routes/interview.routes.js"
import question from './routes/question.route.js';
import category from './routes/category.route.js';
import result from './routes/result.route.js';
import interviewReportRouter from "./routes/interviewReports.js"

const app = express();

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

const io = new Server(httpServer, {
  connectionStateRecovery: {},
  cors: {
    origin: process.env.CLIENT_URL || "https://gappe.vercel.app",
  },
  pingTimeout: 60000,
});

chatSockets(io);

app.use(express.json());

app.get("/", (req, res) => {
  return res.send("<h1>Working Fine</h1>");
});
app.use("/api/user", userRouter);
app.use("/api/therapist", therapistRouter);
app.use("/api/chat", chatRouter);
app.use("/api/slot", slotRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/community", communityRouter);
app.use("/api/event" , eventRouter);
app.use("/api/interview" , interviewRouter);
app.use("/api/interview-reports" , interviewReportRouter);

app.use("/api/question", question);
app.use("/api/category", category);
app.use("/api/quiz", result);

// Connect to DB and Start Server

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Worker running at http://localhost:${PORT}`);
  });
});
