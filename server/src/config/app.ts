import express from "express";
import cors from "cors"; // Cross-Origin Resource Sharing
import cookieParser from "cookie-parser"; // Middleware used for parsing cookies

const app = express();

const allowedOrigins = [
    "https://bytecontest.onrender.com",
    "http://localhost:3000",
    "http://localhost:8080"
];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Other middleware
app.use(express.json({ limit: "128kb" })); // Limit the size of JSON payloads
app.use(express.urlencoded({ extended: true, limit: "128kb" })); // Parse URL-encoded payloads
app.use(express.static("public")); // Serve static files from 'public' folder

app.use(cookieParser());

// Sample route for testing
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Import and use routers
import authRouter from "../routes/auth.routes";
app.use("/api/v1/auth", authRouter);

import problemRouter from "../routes/problem.routes";
app.use("/api/v1/problems", problemRouter);

import judgeRouter from "../routes/judge.routes";
app.use("/api/v1/judge", judgeRouter);

import assignmentRouter from "../routes/assignment.routes";
app.use("/api/v1/assignments", assignmentRouter);

import contestRouter from "../routes/contest.routes";
app.use("/api/v1/contests", contestRouter);

import userRouter from "../routes/user.routes";
app.use("/api/v1/users", userRouter);

export { app };
